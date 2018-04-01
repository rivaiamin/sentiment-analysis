package com.rivaiamin.ml;

import java.io.InputStream;
import java.io.FileInputStream;
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

import opennlp.tools.namefind.TokenNameFinderModel;
import opennlp.tools.namefind.NameFinderME;
import opennlp.tools.sentdetect.SentenceDetectorME;
import opennlp.tools.tokenize.TokenizerME;
import opennlp.tools.sentdetect.SentenceModel;
import opennlp.tools.tokenize.TokenizerModel;
import opennlp.tools.util.Span;

public class NerUpdateProcessorFactory extends UpdateRequestProcessorFactory {
    // Initialize factory
    public void init(NamedList args) {
        super.init(args);
    }

    @Override
    public UpdateRequestProcessor getInstance(SolrQueryRequest req,
    SolrQueryResponse rsp, UpdateRequestProcessor nxt) {
        return new NerUpdateProcessor(nxt);
    }
}

class NerUpdateProcessor extends UpdateRequestProcessor {
    public NerUpdateProcessor ( UpdateRequestProcessor nxt) {
        super( nxt );
    }

    @Override
    public void processAdd(AddUpdateCommand cmd) throws IOException {
        SolrInputDocument doc = cmd.getSolrInputDocument();
        // refer to model file "en-sent,bin", available at link http://opennlp.sourceforge.net/models-1.5/
        InputStream is = new FileInputStream("models/itq-sent.bin");
        SentenceModel sentenceModel = new SentenceModel(is);
        //Loading the tokenizer model
        InputStream inputStreamTokenizer = new FileInputStream("models/en-token.bin");
        TokenizerModel tokenModel = new TokenizerModel(inputStreamTokenizer);
        //Loading the NER model
        InputStream inputStreamNameFinder = new FileInputStream("models/itq-ner-all.bin");
        TokenNameFinderModel nerModel = new TokenNameFinderModel(inputStreamNameFinder);

        // feed the model to SentenceDetectorME class
        SentenceDetectorME sdetector = new SentenceDetectorME(sentenceModel);
        //Instantiating the TokenizerME class
        TokenizerME tokenizer = new TokenizerME(tokenModel);
        //Instantiating the NameFinderME class
        NameFinderME nameFinder = new NameFinderME(nerModel);

        Object content = doc.getFieldValue("content");
        if( content != null ) { 
            // detect sentences in the paragraph
            String sentences[] = sdetector.sentDetect( String.valueOf(content));
            
            for(int i=0;i<sentences.length;i++){

                String tokens[] = tokenizer.tokenize(sentences[i]);
                //Finding the names in the sentence
                Span nameSpans[] = nameFinder.find(tokens);
                for(Span s: nameSpans) {
                    String entity = s.toString().split("\\s+")[1];
                    //System.out.println(s.toString()+"  "+tokens[s.getStart()]);
                    doc.addField(entity, tokens[s.getStart()]);
                }

            }
        }

        // you must make this call
        super.processAdd(cmd);
    }
}
