//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "../eth-infinitism/core/BasePaymaster.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract SponsoringPaymaster is BasePaymaster, AccessControl{

/**
 * SponsoringPaymaster pays for the UserOp if following conditions are met:
 * - The "to" (the address of the actual execution call) address must be whitelisted.
 * - If "isSigRequired" is true then userOp.paymasterAndData must contain a signature from a trusted signer.
 * - The trusted signer must have "SIGNER_ROLE" in this contract. 
*/

    using ECDSA for bytes32;
    using UserOperationLib for UserOperation;

    bytes32 public constant SIGNER_ROLE = keccak256("SIGNER_ROLE");
    bytes32 public constant WHITELISTED = keccak256("WHITELISTED");

    bool public isSigRequired = true;

    uint256 private constant VALID_TIMESTAMP_OFFSET = 20;

    uint256 private constant SIGNATURE_OFFSET = 84;

    mapping(address => uint256) public senderNonce;

    constructor(IEntryPoint _entryPoint, address[] memory _signers) BasePaymaster(_entryPoint) {

        require(_signers.length > 0, "at least one signer is required");

        for(uint i = 0; i < _signers.length; i++) {

            if(hasRole(SIGNER_ROLE, _signers[i]) || _signers[i] == address(0)) {
                continue;
            }

            _grantRole(SIGNER_ROLE, _signers[i]);
        }

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function whiteListAddress(address _address) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(WHITELISTED, _address);
    }

    function unWhiteListAddress(address _address) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(WHITELISTED, _address);
    }

    function setIsSigRequired(bool _val) external onlyRole(DEFAULT_ADMIN_ROLE){
        isSigRequired = _val;
    }

    function pack(UserOperation calldata userOp) internal pure returns (bytes memory ret) {
        // lighter signature scheme. must match UserOp.ts#packUserOp
        bytes calldata pnd = userOp.paymasterAndData;
        // copy directly the userOp from calldata up to (but not including) the paymasterAndData.
        // this encoding depends on the ABI encoding of calldata, but is much lighter to copy
        // than referencing each field separately.
        assembly {
            let ofs := userOp
            let len := sub(sub(pnd.offset, ofs), 32)
            ret := mload(0x40)
            mstore(0x40, add(ret, add(len, 32)))
            mstore(ret, len)
            calldatacopy(add(ret, 32), ofs, len)

        }
    }

    /**
     * return the hash we're going to sign off-chain (and validate on-chain)
     * this method is called by the off-chain signer, to sign the request.
     * it is called on-chain from the validatePaymasterUserOp, to validate the signature.
     * note that this signature covers all fields of the UserOperation, except the "paymasterAndData",
     * which will carry the signature itself.
     */
    function getHash(UserOperation calldata userOp, uint48 validUntil, uint48 validAfter)
    public view returns (bytes32) {
        //can't use userOp.hash(), since it contains also the paymasterAndData itself.
        return keccak256(abi.encode(
                pack(userOp),
                block.chainid,
                address(this),
                senderNonce[userOp.getSender()],
                validUntil,
                validAfter
            ));
    }

    /**
     * verify our external signer signed this request.
     * the "paymasterAndData" is expected to be the paymaster and a signature over the entire request params
     * paymasterAndData[:20] : address(this)
     * paymasterAndData[20:84] : abi.encode(validUntil, validAfter)
     * paymasterAndData[84:] : signature
     */
    function _validatePaymasterUserOp(
        UserOperation calldata userOp, 
        bytes32 /*userOpHash*/, 
        uint256 requiredPreFund
    )
        internal 
        override 
        returns (bytes memory context, uint256 validationData) 
    {
        (requiredPreFund);

        (uint48 validUntil, uint48 validAfter, bytes calldata signature) = parsePaymasterAndData(userOp.paymasterAndData);
        //ECDSA library supports both 64 and 65-byte long signatures.
        // we only "require" it here so that the revert reason on invalid signature will be of "SponsoringPaymaster", and not "ECDSA"
        require(signature.length == 64 || signature.length == 65, "SponsoringPaymaster: invalid signature length in paymasterAndData");
        bytes32 hash = ECDSA.toEthSignedMessageHash(getHash(userOp, validUntil, validAfter));
        senderNonce[userOp.getSender()]++;

        if(
            !checkWhiteListedContract(userOp.callData) || 
            ((isSigRequired) && !hasRole(SIGNER_ROLE, ECDSA.recover(hash, signature)))
        ){
            return ("",_packValidationData(true,validUntil,validAfter));
        }

        //no need for other on-chain validation: entire UserOp should have been checked
        // by the external service prior to signing it.
        return ("",_packValidationData(false,validUntil,validAfter));
    }

    function parsePaymasterAndData(bytes calldata paymasterAndData) public pure returns(uint48 validUntil, uint48 validAfter, bytes calldata signature) {
        (validUntil, validAfter) = abi.decode(paymasterAndData[VALID_TIMESTAMP_OFFSET:SIGNATURE_OFFSET],(uint48, uint48));
        signature = paymasterAndData[SIGNATURE_OFFSET:];
    }


    function checkWhiteListedContract(bytes calldata _calldata) internal view returns (bool) {
        
        return hasRole(WHITELISTED, abi.decode(_calldata[4:24], (address)));
        
    }

}