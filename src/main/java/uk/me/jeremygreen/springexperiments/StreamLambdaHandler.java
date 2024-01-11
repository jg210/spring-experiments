package uk.me.jeremygreen.springexperiments;

import com.amazonaws.serverless.exceptions.ContainerInitializationException;
import com.amazonaws.serverless.proxy.model.AwsProxyRequest;
import com.amazonaws.serverless.proxy.model.AwsProxyResponse;
import com.amazonaws.serverless.proxy.spring.SpringBootLambdaContainerHandler;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

@SuppressWarnings("unused")
public final class StreamLambdaHandler implements RequestStreamHandler {

    private static SpringBootLambdaContainerHandler<AwsProxyRequest,AwsProxyResponse> createHandler() {
        try {
            return SpringBootLambdaContainerHandler.getAwsProxyHandler(
                    SpringExperimentsApplication.class);
        } catch (ContainerInitializationException e) {
            throw new RuntimeException(e);
        }
    }

    private static final SpringBootLambdaContainerHandler<AwsProxyRequest,AwsProxyResponse> handler = createHandler();

    @Override
    public void handleRequest(
            final InputStream inputStream,
            final OutputStream outputStream,
            final Context context) throws IOException {
        handler.proxyStream(inputStream, outputStream, context);
    }

}
