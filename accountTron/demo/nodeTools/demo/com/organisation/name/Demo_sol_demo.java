package com.organisation.name;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;

/**
 * <p>Auto generated code.
 * <p><strong>Do not modify!</strong>
 * <p>Please use the <a href="https://docs.web3j.io/command_line.html">web3j command line tools</a>,
 * or the org.web3j.codegen.SolidityFunctionWrapperGenerator in the 
 * <a href="https://github.com/web3j/web3j/tree/master/codegen">codegen module</a> to update.
 *
 * <p>Generated with web3j version 3.5.0.
 */
public class Demo_sol_demo extends Contract {
    private static final String BINARY = "608060405234801561001057600080fd5b5061021b806100206000396000f3006080604052600436106100565763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416631ab06ee5811461005b5780634a512511146100785780639507d39a146100e3575b600080fd5b34801561006757600080fd5b506100766004356024356100fb565b005b34801561008457600080fd5b506040805160206004803580820135601f81018490048402850184019095528484526100d194369492936024939284019190819084018382808284375094975061010d9650505050505050565b60408051918252519081900360200190f35b3480156100ef57600080fd5b506100d1600435610131565b60009182526020829052604090912055565b600080600061011b84610143565b8152602001908152602001600020549050919050565b60009081526020819052604090205490565b6000808060045b84518110156101e657848181518110151561016157fe5b01602001517f0100000000000000000000000000000000000000000000000000000000000000908190048102049150603082108015906101a15750603a82105b156101ba576030826004859060020a02010392506101de565b606182101580156101cb5750606782105b1561005657601092909202810160561901915b60010161014a565b509093925050505600a165627a7a72305820b9c7599cc2fc223bf02029c07b51f35355e0995996ae56cd6b20ad8a9873702b0029";

    public static final String FUNC_SET = "set";

    public static final String FUNC_GETUINT = "getUint";

    public static final String FUNC_GET = "get";

    protected Demo_sol_demo(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    protected Demo_sol_demo(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    public RemoteCall<TransactionReceipt> set(BigInteger key, BigInteger value) {
        final Function function = new Function(
                FUNC_SET, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(key), 
                new org.web3j.abi.datatypes.generated.Uint256(value)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteCall<BigInteger> getUint(byte[] _data) {
        final Function function = new Function(FUNC_GETUINT, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.DynamicBytes(_data)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteCall<BigInteger> get(BigInteger key) {
        final Function function = new Function(FUNC_GET, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(key)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public static RemoteCall<Demo_sol_demo> deploy(Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(Demo_sol_demo.class, web3j, credentials, gasPrice, gasLimit, BINARY, "");
    }

    public static RemoteCall<Demo_sol_demo> deploy(Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(Demo_sol_demo.class, web3j, transactionManager, gasPrice, gasLimit, BINARY, "");
    }

    public static Demo_sol_demo load(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return new Demo_sol_demo(contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    public static Demo_sol_demo load(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return new Demo_sol_demo(contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }
}
