package com.rivaiamin.ml;

import java.io.InputStream;
import java.io.FileInputStream;
import java.net.URL;
import java.io.IOException;
//import java.util.ArrayList;
import java.util.List;

import org.apache.solr.common.SolrInputDocument;
import org.apache.solr.common.util.NamedList;
import org.apache.solr.request.SolrQueryRequest;
import org.apache.solr.response.SolrQueryResponse;
import org.apache.solr.update.AddUpdateCommand;
import org.apache.solr.update.processor.UpdateRequestProcessor;
import org.apache.solr.update.processor.UpdateRequestProcessorFactory;
import org.apache.lucene.analysis.id.IndonesianStemmer;

//import opennlp.tools.namefind.TokenNameFinderModel;
//import opennlp.tools.namefind.NameFinderME;
import opennlp.tools.doccat.DocumentCategorizerME;
import opennlp.tools.doccat.DoccatModel;
//import opennlp.tools.sentdetect.SentenceDetectorME;
//import opennlp.tools.sentdetect.SentenceModel;
import opennlp.tools.tokenize.TokenizerME;
import opennlp.tools.tokenize.TokenizerModel;
import opennlp.tools.util.Span;

public class SentimentUpdateProcessorFactory extends UpdateRequestProcessorFactory {
    // Initialize factory
    public void init(NamedList args) {
        super.init(args);
    }

    @Override
    public UpdateRequestProcessor getInstance(SolrQueryRequest req,
    SolrQueryResponse rsp, UpdateRequestProcessor nxt) {
        return new SentimentUpdateProcessor(nxt);
    }
}

class SentimentUpdateProcessor extends UpdateRequestProcessor {
    public SentimentUpdateProcessor ( UpdateRequestProcessor nxt) {
        super( nxt );
    }

    @Override
    public void processAdd(AddUpdateCommand cmd) throws IOException {
        SolrInputDocument doc = cmd.getSolrInputDocument();
        
        // refer to model file "en-sent,bin", available at link http://opennlp.sourceforge.net/models-1.5/
        
        // loading sentence model
        //InputStream sentenceModelFile = new URL("http://sentiman.dev/models/en-sentence.bin").openStream();
        //SentenceModel sentenceModel = new SentenceModel(sentenceModelFile);
        
        //Loading the tokenizer model
        InputStream inputStreamTokenizer = new URL("http://sentiman.dev/models/en-token.bin").openStream();
        TokenizerModel tokenModel = new TokenizerModel(inputStreamTokenizer);
        
        //Loading the Sentiment model
        InputStream saModelFile = new URL("http://sentiman.dev/models/id-sentiment.bin").openStream();
        DoccatModel saModel = new DoccatModel(saModelFile);
        
        // feed the model to SentenceDetectorME class
        //SentenceDetectorME sdetector = new SentenceDetectorME(sentenceModel);
        //Instantiating the TokenizerME class
        TokenizerME tokenizer = new TokenizerME(tokenModel);
        
        //Instantiating the DocumentCategorizerME class
        DocumentCategorizerME myCategorizer = new DocumentCategorizerME(saModel);

        Object content = doc.getFieldValue("text");
        if( content != null ) { 
            // detect tokens in the paragraph
            String tokens[] = tokenizer.tokenize( String.valueOf(content));
            
            //String inputText = sentences[i];
            double[] outcomes = myCategorizer.categorize(tokens);
            String sentiment = myCategorizer.getBestCategory(outcomes);
            doc.addField("sentiment", sentiment);
        }

        // you must make this call
        super.processAdd(cmd);
    }
}
