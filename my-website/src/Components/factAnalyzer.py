# fun_fact_analyzer.py
import json  # Import the json module
import sys
import nltk
from nltk import pos_tag, word_tokenize
from nltk.chunk import ne_chunk

def extract_entities(text):
    words = word_tokenize(text)
    tagged_words = pos_tag(words)
    entities = ne_chunk(tagged_words)
    relevant_words = []
    for entity in entities:
        if isinstance(entity, tuple):
            relevant_words.append(entity[0])
        elif isinstance(entity, nltk.Tree):
            relevant_words.append(" ".join([word for word, tag in entity.leaves()]))
    return relevant_words

def calculate_word_scores(text):
    entities = extract_entities(text)
    word_scores = {}
    for entity in entities:
        if entity.lower() not in word_scores:
            word_scores[entity.lower()] = 1
        else:
            word_scores[entity.lower()] += 1
    return word_scores


if __name__ == "__main__":
    text = sys.argv[1]
    word_scores = calculate_word_scores(text)
    print(json.dumps(word_scores))
