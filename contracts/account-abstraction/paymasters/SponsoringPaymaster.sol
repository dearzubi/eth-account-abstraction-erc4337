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
    bytes32 public constant BLACKLISTED = keccak256("BLACKLISTED");

    bool public isSigRequired;

    uint256 private constant VALID_TIMESTAMP_OFFSET = 20;
    uint256 private constant SIGNATURE_OFFSET = 84;

    uint256 private constant ADDRESS_OFFSET = 4;
    uint256 private constant VALUE_OFFSET = 36;

    mapping(address => uint256) public senderNonce;

    /**
     * @dev constructor for SponsoringPaymaster
     * @param _entryPoint entry point contract
     */
    constructor(IEntryPoint _entryPoint) BasePaymaster(_entryPoint) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Assign or revoke roles to addresses in batch
     * @param _address List of addresses to set roles to
     * @param _roles List of roles to set
     * @param revoke List of booleans. if true, revoke the respective role to respective address in the list. otherwise grant it.
     */
    function setBatchRoles(address[] calldata _address, bytes32[] calldata _roles, bool[] calldata revoke) 
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {

        require(_address.length == _roles.length && _address.length == revoke.length, "invalid input");

        for(uint i = 0; i < _address.length; i++) {

            if(_address[i] == address(0)) continue;
            _setRoleToAddress(_roles[i], _address[i], revoke[i]);
        }

    }

    /**
     * @dev Assign or revoke a role to an address
     * @param _role Role to set. e.g WHITELISTED, BLACKLISTED, SIGNER_ROLE
     * @param _address Address to set role to
     * @param revoke If true, revoke the role. otherwise grant it.
     */
    function setRoleToAddress(bytes32 _role, address _address, bool revoke) external onlyRole(DEFAULT_ADMIN_ROLE) {

        require(_address != address(0), "invalid address");

        _setRoleToAddress(_role, _address, revoke);
    }

    /**
     * @dev Assign or revoke a role to an address
     * @param _role Role to set. e.g WHITELISTED, BLACKLISTED, SIGNER_ROLE
     * @param _address Address to set role to
     * @param revoke If true, revoke the role. otherwise grant it.
     */
    function _setRoleToAddress(bytes32 _role, address _address, bool revoke) internal {

        if(revoke && hasRole(_role, _address)) revokeRole(_role, _address);
        else if(!revoke && !hasRole(_role, _address)) grantRole(_role, _address);
        
    }

    function setIsSigRequired(bool _val) external onlyRole(DEFAULT_ADMIN_ROLE){
        isSigRequired = _val;
    }

    /**
     * return the hash we're going to sign off-chain (and validate on-chain)
     * this method is called by the off-chain signer, to sign the request.
     * it is called on-chain from the validatePaymasterUserOp, to validate the signature.
     * note that this signature covers all fields of the UserOperation, except the "paymasterAndData",
     * which will carry the signature itself.
     * Note: This function is taken from:
     * https://github.com/eth-infinitism/account-abstraction/blob/9b5f2e4bb30a81aa30761749d9e2e43fee64c768/contracts/samples/VerifyingPaymaster.sol
     * and then slightly modified.
     */
    function getHash(UserOperation calldata userOp, uint48 validUntil, uint48 validAfter)
    public view returns (bytes32) {
        //can't use userOp.hash(), since it contains also the paymasterAndData itself.
        return keccak256(abi.encode(
                userOp.packWithoutPaymasterAndData(),
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
     * Note: This function is taken from:
     * https://github.com/eth-infinitism/account-abstraction/blob/9b5f2e4bb30a81aa30761749d9e2e43fee64c768/contracts/samples/VerifyingPaymaster.sol
     * and then modified.
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
        (requiredPreFund); //unused

        bool passed = !hasRole(BLACKLISTED, userOp.getSender()) && isToAddressWhiteListed(userOp.callData);

        if(isSigRequired) {

            (uint48 validUntil, uint48 validAfter, bytes calldata signature) = parsePaymasterAndData(userOp.paymasterAndData);
            //ECDSA library supports both 64 and 65-byte long signatures.
            // we only "require" it here so that the revert reason on invalid signature will be of "SponsoringPaymaster", and not "ECDSA"
            require(signature.length == 64 || signature.length == 65, "SponsoringPaymaster: invalid signature length in paymasterAndData");
            bytes32 hash = ECDSA.toEthSignedMessageHash(getHash(userOp, validUntil, validAfter));
            senderNonce[userOp.getSender()]++;

            passed = passed && hasRole(SIGNER_ROLE, ECDSA.recover(hash, signature));

            if(passed){
                return ("",_packValidationData(false,validUntil,validAfter));
            }
            return ("",_packValidationData(true,validUntil,validAfter));

        }

        if(passed){
            return ("",_packValidationData(false,0,0));
        }
        return ("",_packValidationData(true,0,0));

    }
    /**
     * @dev parses the paymasterAndData field of the userOp
     * @param paymasterAndData the paymasterAndData field of the userOp
     * @return validUntil
     * @return validAfter 
     * @return signature 
     * Note: This function expects paymasterAndData field is of the following format:
     * paymasterAndData[:20] : address(this)
     * paymasterAndData[20:84] : abi.encode(validUntil, validAfter)
     * paymasterAndData[84:] : signature
     */

    function parsePaymasterAndData(bytes calldata paymasterAndData) 
        public 
        pure 
        returns
        (
            uint48 validUntil, 
            uint48 validAfter, 
            bytes calldata signature
        ) 
    {
        (validUntil, validAfter) = abi.decode(paymasterAndData[VALID_TIMESTAMP_OFFSET:SIGNATURE_OFFSET],(uint48, uint48));
        signature = paymasterAndData[SIGNATURE_OFFSET:];
    }


    /**
     * @dev check if the TO address in the calldata is whitelisted
     * @param _calldata the calldata of the userOp
     * Note: This function expects that the calldata is encoded in the form: somefunction(address,uint256,bytes)
     * 
     */
    function isToAddressWhiteListed(bytes calldata _calldata) internal view returns (bool) {
        
        return hasRole(WHITELISTED, abi.decode(_calldata[ADDRESS_OFFSET:VALUE_OFFSET], (address)));
        
    }

}