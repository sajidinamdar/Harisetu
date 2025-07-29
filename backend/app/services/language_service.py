# services/language_service.py
from typing import Dict, List, Any, Optional
import os

# Dictionary for common agricultural terms translation
AGRICULTURAL_TERMS = {
    "en_to_mr": {
        "water": "पाणी",
        "fertilizer": "खत",
        "pesticide": "कीटकनाशक",
        "crop": "पीक",
        "seed": "बियाणे",
        "soil": "माती",
        "harvest": "कापणी",
        "irrigation": "सिंचन",
        "organic": "सेंद्रिय",
        "subsidy": "अनुदान",
        "weather": "हवामान",
        "rain": "पाऊस",
        "drought": "दुष्काळ",
        "farmer": "शेतकरी",
        "agriculture": "शेती",
        "disease": "रोग",
        "pest": "कीड",
        "market": "बाजार",
        "price": "किंमत",
        "government": "सरकार",
        "scheme": "योजना"
    },
    "mr_to_en": {
        "पाणी": "water",
        "खत": "fertilizer",
        "कीटकनाशक": "pesticide",
        "पीक": "crop",
        "बियाणे": "seed",
        "माती": "soil",
        "कापणी": "harvest",
        "सिंचन": "irrigation",
        "सेंद्रिय": "organic",
        "अनुदान": "subsidy",
        "हवामान": "weather",
        "पाऊस": "rain",
        "दुष्काळ": "drought",
        "शेतकरी": "farmer",
        "शेती": "agriculture",
        "रोग": "disease",
        "कीड": "pest",
        "बाजार": "market",
        "किंमत": "price",
        "सरकार": "government",
        "योजना": "scheme"
    }
}

def translate_text(text: str, source_lang: str, target_lang: str) -> str:
    """
    Translate text between English and Marathi.
    
    In a real implementation, this would use a translation API like Google Translate.
    For now, we'll use a simple dictionary-based approach for common agricultural terms.
    
    Args:
        text: Text to translate
        source_lang: Source language code (en, mr)
        target_lang: Target language code (en, mr)
        
    Returns:
        Translated text
    """
    if source_lang == target_lang:
        return text
    
    # Check if we have a translation dictionary for this language pair
    if source_lang == "en" and target_lang == "mr":
        translation_dict = AGRICULTURAL_TERMS["en_to_mr"]
    elif source_lang == "mr" and target_lang == "en":
        translation_dict = AGRICULTURAL_TERMS["mr_to_en"]
    else:
        # Unsupported language pair
        return text
    
    # Simple word-by-word translation
    words = text.split()
    translated_words = []
    
    for word in words:
        # Remove punctuation for lookup
        clean_word = word.lower().strip(".,!?;:()")
        
        if clean_word in translation_dict:
            # Replace with translation, preserving case and punctuation
            punctuation = ""
            if word[-1] in ".,!?;:()":
                punctuation = word[-1]
            
            if word[0].isupper():
                translated_word = translation_dict[clean_word].capitalize() + punctuation
            else:
                translated_word = translation_dict[clean_word] + punctuation
                
            translated_words.append(translated_word)
        else:
            # Keep original word if no translation found
            translated_words.append(word)
    
    return " ".join(translated_words)

def detect_language(text: str) -> str:
    """
    Detect the language of the given text.
    
    In a real implementation, this would use a language detection library or API.
    For now, we'll use a simple heuristic based on character sets.
    
    Args:
        text: Text to analyze
        
    Returns:
        Language code (en, mr)
    """
    # Simple heuristic: if the text contains Devanagari characters, assume it's Marathi
    devanagari_range = range(0x0900, 0x097F)
    
    for char in text:
        if ord(char) in devanagari_range:
            return "mr"
    
    # Default to English
    return "en"