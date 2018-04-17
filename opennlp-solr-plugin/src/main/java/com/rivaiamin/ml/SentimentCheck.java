package com.rivaiamin.ml;

import java.io.InputStream;
//import java.io.FileInputStream;
import java.net.URL;
import java.io.IOException;
//import java.util.ArrayList;

//import opennlp.tools.namefind.TokenNameFinderModel;
//import opennlp.tools.namefind.NameFinderME;
import opennlp.tools.doccat.DocumentCategorizerME;
import opennlp.tools.doccat.DoccatModel;
//import opennlp.tools.sentdetect.SentenceDetectorME;
//import opennlp.tools.sentdetect.SentenceModel;
import opennlp.tools.tokenize.TokenizerME;
import opennlp.tools.tokenize.TokenizerModel;

public class SentimentCheck {
    public static void main(String args[]) throws IOException{
        // Loading Sentence Model
        //InputStream sentenceModelFile = new URL("http://sentiman.dev/models/en-sentence.bin").openStream();
        //SentenceModel sentenceModel = new SentenceModel(sentenceModelFile);
        
        //Loading the tokenizer model
        InputStream inputStreamTokenizer = new URL("http://sentiman.dev/models/en-token.bin").openStream();
        TokenizerModel tokenModel = new TokenizerModel(inputStreamTokenizer);
        
        //Loading the NER model
        InputStream saModelFile = new URL("http://sentiman.dev/models/id-sentiment.bin").openStream();
        DoccatModel saModel = new DoccatModel(saModelFile);
        
        // feed the model to SentenceDetectorME class
        //SentenceDetectorME sdetector = new SentenceDetectorME(sentenceModel);
        //Instantiating the TokenizerME class
        TokenizerME tokenizer = new TokenizerME(tokenModel);
        
        //Instantiating the DocumentCategorizerME class
        DocumentCategorizerME myCategorizer = new DocumentCategorizerME(saModel);

        String text = args[0];

        // detect tokens in the paragraph
        String tokens[] = tokenizer.tokenize(text);
        
        //String inputText = sentences[i];
        double[] outcomes = myCategorizer.categorize(tokens);
        String sentiment = myCategorizer.getBestCategory(outcomes);

        System.out.print(sentiment);    
    }
}
