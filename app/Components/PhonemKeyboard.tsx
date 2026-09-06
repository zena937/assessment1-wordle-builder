'use client';

interface PhonemeKeyboardProps {
  onPhonemeSelect: (phoneme: string) => void;
  selectedPhonemes: string[];
}

const PhonemeKeyboard = ({ onPhonemeSelect, selectedPhonemes }: PhonemeKeyboardProps) => {
  // HCE Phoneme Keyboard layout
  const keyboardRows = [
    ['p', 't', 'k', 'b', 'd', 'g'],
    ['n', 'm', 'ŋ', 'f', 's', 'θ'],
    ['v', 'z', 'ð', 'ʒ', 'l', 'ɹ'],
    ['w', 'j', 'h', 'tʃ', 'dʒ'],
    ['iː', 'ɪ', 'e', 'eː', 'æ', 'ɐ'],
    ['ɐː', 'ɜː', 'ʉː', 'ɔ', 'oː', 'ʊ'],
    ['æɪ', 'ɑe', 'oɪ', 'əʉ', 'æɔ', 'ɪə']
  ];

  // Map phonemes to English hints
  const phonemeHints: { [key: string]: string } = {
    'p': 'p as in pit',
    't': 't as in tin',
    'k': 'k as in kin',
    'b': 'b as in bin',
    'd': 'd as in din',
    'g': 'g as in gin',
    'n': 'n as in nit',
    'm': 'm as in mit',
    'ŋ': 'ŋ as in sing',
    'f': 'f as in fin',
    's': 's as in sin',
    'θ': 'θ as in thin',
    'v': 'v as in vat',
    'z': 'z as in zip',
    'ð': 'ð as in then',
    'ʒ': 'ʒ as in measure',
    'l': 'l as in lip',
    'ɹ': 'ɹ as in rip',
    'w': 'w as in win',
    'j': 'j as in yes',
    'h': 'h as in hat',
    'tʃ': 'tʃ as in chin',
    'dʒ': 'dʒ as in gin',
    'iː': 'iː as in see',
    'ɪ': 'ɪ as in sit',
    'e': 'e as in set',
    'eː': 'eː as in say',
    'æ': 'æ as in sat',
    'ɐ': 'ɐ as in sun',
    'ɐː': 'ɐː as in car',
    'ɜː': 'ɜː as in bird',
    'ʉː': 'ʉː as in boot',
    'ɔ': 'ɔ as in log',
    'oː': 'oː as in law',
    'ʊ': 'ʊ as in book',
    'æɪ': 'æɪ as in bait',
    'ɑe': 'ɑe as in bike',
    'oɪ': 'oɪ as in boil',
    'əʉ': 'əʉ as in boat',
    'æɔ': 'æɔ as in cloud',
    'ɪə': 'ɪə as in beard'
  };

  return (
    <div className="phoneme-keyboard">
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="d-flex justify-content-center gap-1 mb-1">
          {row.map((phoneme) => (
            <button
              key={phoneme}
              className={`btn btn-sm ${selectedPhonemes.includes(phoneme) ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => onPhonemeSelect(phoneme)}
              title={phonemeHints[phoneme] || phoneme}
              style={{
                minWidth: '45px',
                height: '40px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                position: 'relative'
              }}
            >
              {phoneme}
              <span 
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-info" 
                style={{ fontSize: '0.5rem', display: 'none' }}
              >
                ?
              </span>
            </button>
          ))}
        </div>
      ))}
      <div className="mt-2 text-muted small">
        💡 Hover over a phoneme to see its English equivalent
      </div>
    </div>
  );
};

export default PhonemeKeyboard;