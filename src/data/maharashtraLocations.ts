// Maharashtra districts, talukas, and villages data
export interface LocationData {
  districts: {
    [key: string]: {
      name: string;
      name_mr: string;
      talukas: {
        [key: string]: {
          name: string;
          name_mr: string;
          villages: {
            name: string;
            name_mr: string;
          }[];
        };
      };
    };
  };
}

export const maharashtraLocations: LocationData = {
  districts: {
    // विदर्भ (पूर्व महाराष्ट्र)
    nagpur: {
      name: "Nagpur",
      name_mr: "नागपूर",
      talukas: {
        nagpur_urban: {
          name: "Nagpur Urban",
          name_mr: "नागपूर शहर",
          villages: [
            { name: "Dharampeth", name_mr: "धरमपेठ" },
            { name: "Sadar", name_mr: "सदर" },
            { name: "Sitabuldi", name_mr: "सीताबर्डी" },
            { name: "Mahal", name_mr: "महाल" },
            { name: "Itwari", name_mr: "इतवारी" }
          ]
        },
        nagpur_rural: {
          name: "Nagpur Rural",
          name_mr: "नागपूर ग्रामीण",
          villages: [
            { name: "Butibori", name_mr: "बुटीबोरी" },
            { name: "Takalghat", name_mr: "तकळघाट" },
            { name: "Sonegaon", name_mr: "सोनेगाव" }
          ]
        },
        hingna: {
          name: "Hingna",
          name_mr: "हिंगणा",
          villages: [
            { name: "Hingna", name_mr: "हिंगणा" },
            { name: "Wanadongri", name_mr: "वनडोंगरी" }
          ]
        },
        kamptee: {
          name: "Kamptee",
          name_mr: "कामठी",
          villages: [
            { name: "Kamptee", name_mr: "कामठी" }
          ]
        },
        kuhi: {
          name: "Kuhi",
          name_mr: "कुही",
          villages: [
            { name: "Kuhi", name_mr: "कुही" }
          ]
        },
        bhiwapur: {
          name: "Bhiwapur",
          name_mr: "भिवापूर",
          villages: [
            { name: "Bhiwapur", name_mr: "भिवापूर" }
          ]
        },
        umred: {
          name: "Umred",
          name_mr: "उमरड",
          villages: [
            { name: "Umred", name_mr: "उमरड" }
          ]
        },
        mauda: {
          name: "Mauda",
          name_mr: "मौदा",
          villages: [
            { name: "Mauda", name_mr: "मौदा" }
          ]
        },
        ramtek: {
          name: "Ramtek",
          name_mr: "रामटेक",
          villages: [
            { name: "Ramtek", name_mr: "रामटेक" }
          ]
        },
        parseoni: {
          name: "Parseoni",
          name_mr: "परशिवनी",
          villages: [
            { name: "Parseoni", name_mr: "परशिवनी" }
          ]
        },
        saoner: {
          name: "Saoner",
          name_mr: "सावनेर",
          villages: [
            { name: "Saoner", name_mr: "सावनेर" }
          ]
        },
        katol: {
          name: "Katol",
          name_mr: "कटोल",
          villages: [
            { name: "Katol", name_mr: "कटोल" }
          ]
        },
        narkhed: {
          name: "Narkhed",
          name_mr: "नरखेड़",
          villages: [
            { name: "Narkhed", name_mr: "नरखेड़" }
          ]
        },
        kalmeshwar: {
          name: "Kalmeshwar",
          name_mr: "कळमेश्वर",
          villages: [
            { name: "Kalmeshwar", name_mr: "कळमेश्वर" }
          ]
        }
      }
    },
    wardha: {
      name: "Wardha",
      name_mr: "वर्धा",
      talukas: {
        wardha: {
          name: "Wardha",
          name_mr: "वर्धा",
          villages: [
            { name: "Wardha", name_mr: "वर्धा" },
            { name: "Deoli", name_mr: "देवळी" }
          ]
        }
      }
    },
    bhandara: {
      name: "Bhandara",
      name_mr: "भंडारा",
      talukas: {
        bhandara: {
          name: "Bhandara",
          name_mr: "भंडारा",
          villages: [
            { name: "Bhandara", name_mr: "भंडारा" }
          ]
        }
      }
    },
    gondia: {
      name: "Gondia",
      name_mr: "गोंदिया",
      talukas: {
        gondia: {
          name: "Gondia",
          name_mr: "गोंदिया",
          villages: [
            { name: "Gondia", name_mr: "गोंदिया" }
          ]
        }
      }
    },
    chandrapur: {
      name: "Chandrapur",
      name_mr: "चंद्रपूर",
      talukas: {
        chandrapur: {
          name: "Chandrapur",
          name_mr: "चंद्रपूर",
          villages: [
            { name: "Chandrapur", name_mr: "चंद्रपूर" }
          ]
        }
      }
    },
    gadchiroli: {
      name: "Gadchiroli",
      name_mr: "गडचिरोली",
      talukas: {
        gadchiroli: {
          name: "Gadchiroli",
          name_mr: "गडचिरोली",
          villages: [
            { name: "Gadchiroli", name_mr: "गडचिरोली" }
          ]
        }
      }
    },
    akola: {
      name: "Akola",
      name_mr: "अकोला",
      talukas: {
        akola: {
          name: "Akola",
          name_mr: "अकोला",
          villages: [
            { name: "Akola", name_mr: "अकोला" }
          ]
        }
      }
    },
    amravati: {
      name: "Amravati",
      name_mr: "अमरावती",
      talukas: {
        amravati: {
          name: "Amravati",
          name_mr: "अमरावती",
          villages: [
            { name: "Amravati", name_mr: "अमरावती" }
          ]
        },
        achalpur: {
          name: "Achalpur",
          name_mr: "अचलपूर",
          villages: [
            { name: "Achalpur", name_mr: "अचलपूर" }
          ]
        },
        dharni: {
          name: "Dharni",
          name_mr: "धारणी",
          villages: [
            { name: "Dharni", name_mr: "धारणी" }
          ]
        },
        chikhaldara: {
          name: "Chikhaldara",
          name_mr: "चिखलदरा",
          villages: [
            { name: "Chikhaldara", name_mr: "चिखलदरा" }
          ]
        },
        morshi: {
          name: "Morshi",
          name_mr: "मोर्शी",
          villages: [
            { name: "Morshi", name_mr: "मोर्शी" }
          ]
        },
        warud: {
          name: "Warud",
          name_mr: "वरुड",
          villages: [
            { name: "Warud", name_mr: "वरुड" }
          ]
        },
        nandgaon_khandeshwar: {
          name: "Nandgaon Khandeshwar",
          name_mr: "नांदगाव खंडेश्वर",
          villages: [
            { name: "Nandgaon Khandeshwar", name_mr: "नांदगाव खंडेश्वर" }
          ]
        },
        daryapur: {
          name: "Daryapur",
          name_mr: "दर्यापूर",
          villages: [
            { name: "Daryapur", name_mr: "दर्यापूर" }
          ]
        },
        chandur_railway: {
          name: "Chandur Railway",
          name_mr: "चांदूर रेल्वे",
          villages: [
            { name: "Chandur Railway", name_mr: "चांदूर रेल्वे" }
          ]
        },
        chandur_bazar: {
          name: "Chandur Bazar",
          name_mr: "चांदूर बाजार",
          villages: [
            { name: "Chandur Bazar", name_mr: "चांदूर बाजार" }
          ]
        },
        anjangaon_surji: {
          name: "Anjangaon Surji",
          name_mr: "अंजनगाव सुरजी",
          villages: [
            { name: "Anjangaon Surji", name_mr: "अंजनगाव सुरजी" }
          ]
        },
        tiwasa: {
          name: "Tiwasa",
          name_mr: "तिवसा",
          villages: [
            { name: "Tiwasa", name_mr: "तिवसा" }
          ]
        },
        bhatkuli: {
          name: "Bhatkuli",
          name_mr: "भातकुली",
          villages: [
            { name: "Bhatkuli", name_mr: "भातकुली" }
          ]
        },
        dhamangaon_railway: {
          name: "Dhamangaon Railway",
          name_mr: "धामणगाव रेल्वे",
          villages: [
            { name: "Dhamangaon Railway", name_mr: "धामणगाव रेल्वे" }
          ]
        }
      }
    },
    buldhana: {
      name: "Buldhana",
      name_mr: "बुलढाणा",
      talukas: {
        buldhana: {
          name: "Buldhana",
          name_mr: "बुलढाणा",
          villages: [
            { name: "Buldhana", name_mr: "बुलढाणा" }
          ]
        },
        chikhli: {
          name: "Chikhli",
          name_mr: "चिखली",
          villages: [
            { name: "Chikhli", name_mr: "चिखली" }
          ]
        },
        deulgaon_raja: {
          name: "Deulgaon Raja",
          name_mr: "देऊळगाव राजा",
          villages: [
            { name: "Deulgaon Raja", name_mr: "देऊळगाव राजा" }
          ]
        },
        mehkar: {
          name: "Mehkar",
          name_mr: "मेहकर",
          villages: [
            { name: "Mehkar", name_mr: "मेहकर" }
          ]
        },
        sindkhed_raja: {
          name: "Sindkhed Raja",
          name_mr: "सिंदखेडराजा",
          villages: [
            { name: "Sindkhed Raja", name_mr: "सिंदखेडराजा" }
          ]
        },
        lonar: {
          name: "Lonar",
          name_mr: "लोणार",
          villages: [
            { name: "Lonar", name_mr: "लोणार" }
          ]
        },
        khamgaon: {
          name: "Khamgaon",
          name_mr: "खामगाव",
          villages: [
            { name: "Khamgaon", name_mr: "खामगाव" }
          ]
        },
        shegaon: {
          name: "Shegaon",
          name_mr: "शेगाव",
          villages: [
            { name: "Shegaon", name_mr: "शेगाव" }
          ]
        },
        malkapur: {
          name: "Malkapur",
          name_mr: "मलकापूर",
          villages: [
            { name: "Malkapur", name_mr: "मलकापूर" }
          ]
        },
        jalgaon_jamod: {
          name: "Jalgaon Jamod",
          name_mr: "जळगाव जामोद",
          villages: [
            { name: "Jalgaon Jamod", name_mr: "जळगाव जामोद" }
          ]
        },
        nandura: {
          name: "Nandura",
          name_mr: "नांदुरा",
          villages: [
            { name: "Nandura", name_mr: "नांदुरा" }
          ]
        },
        motala: {
          name: "Motala",
          name_mr: "मोताळा",
          villages: [
            { name: "Motala", name_mr: "मोताळा" }
          ]
        },
        sangrampur: {
          name: "Sangrampur",
          name_mr: "संग्रामपूर",
          villages: [
            { name: "Sangrampur", name_mr: "संग्रामपूर" }
          ]
        }
      }
    },
    washim: {
      name: "Washim",
      name_mr: "वाशिम",
      talukas: {
        washim: {
          name: "Washim",
          name_mr: "वाशिम",
          villages: [
            { name: "Washim", name_mr: "वाशिम" }
          ]
        },
        mangrulpir: {
          name: "Mangrulpir",
          name_mr: "मंगरूळपीर",
          villages: [
            { name: "Mangrulpir", name_mr: "मंगरूळपीर" }
          ]
        },
        risod: {
          name: "Risod",
          name_mr: "रिसोड",
          villages: [
            { name: "Risod", name_mr: "रिसोड" }
          ]
        },
        karanja: {
          name: "Karanja",
          name_mr: "कारंजा",
          villages: [
            { name: "Karanja", name_mr: "कारंजा" }
          ]
        },
        malegaon: {
          name: "Malegaon",
          name_mr: "मालेगाव",
          villages: [
            { name: "Malegaon", name_mr: "मालेगाव" }
          ]
        },
        manora: {
          name: "Manora",
          name_mr: "मनोरा",
          villages: [
            { name: "Manora", name_mr: "मनोरा" }
          ]
        }
      }
    },
    yavatmal: {
      name: "Yavatmal",
      name_mr: "यवतमाळ",
      talukas: {
        yavatmal: {
          name: "Yavatmal",
          name_mr: "यवतमाळ",
          villages: [
            { name: "Yavatmal", name_mr: "यवतमाळ" }
          ]
        },
        umarkhed: {
          name: "Umarkhed",
          name_mr: "उमरखेड",
          villages: [
            { name: "Umarkhed", name_mr: "उमरखेड" }
          ]
        },
        digras: {
          name: "Digras",
          name_mr: "दिग्रस",
          villages: [
            { name: "Digras", name_mr: "दिग्रस" }
          ]
        },
        pusad: {
          name: "Pusad",
          name_mr: "पुसद",
          villages: [
            { name: "Pusad", name_mr: "पुसद" }
          ]
        },
        wani: {
          name: "Wani",
          name_mr: "वणी",
          villages: [
            { name: "Wani", name_mr: "वणी" }
          ]
        },
        arni: {
          name: "Arni",
          name_mr: "आर्णी",
          villages: [
            { name: "Arni", name_mr: "आर्णी" }
          ]
        },
        ner: {
          name: "Ner",
          name_mr: "नेर",
          villages: [
            { name: "Ner", name_mr: "नेर" }
          ]
        },
        kalamb: {
          name: "Kalamb",
          name_mr: "कलंब",
          villages: [
            { name: "Kalamb", name_mr: "कलंब" }
          ]
        },
        babulgaon: {
          name: "Babulgaon",
          name_mr: "बाभुळगाव",
          villages: [
            { name: "Babulgaon", name_mr: "बाभुळगाव" }
          ]
        },
        ghatanji: {
          name: "Ghatanji",
          name_mr: "घाटंजी",
          villages: [
            { name: "Ghatanji", name_mr: "घाटंजी" }
          ]
        },
        ralegaon: {
          name: "Ralegaon",
          name_mr: "राळेगाव",
          villages: [
            { name: "Ralegaon", name_mr: "राळेगाव" }
          ]
        },
        mahagaon: {
          name: "Mahagaon",
          name_mr: "महागाव",
          villages: [
            { name: "Mahagaon", name_mr: "महागाव" }
          ]
        },
        maregaon: {
          name: "Maregaon",
          name_mr: "मारेगाव",
          villages: [
            { name: "Maregaon", name_mr: "मारेगाव" }
          ]
        },
        zari_jamani: {
          name: "Zari Jamani",
          name_mr: "झरी जामणी",
          villages: [
            { name: "Zari Jamani", name_mr: "झरी जामणी" }
          ]
        },
        darwha: {
          name: "Darwha",
          name_mr: "दारव्हा",
          villages: [
            { name: "Darwha", name_mr: "दारव्हा" }
          ]
        },
        pandharkawada: {
          name: "Pandharkawada",
          name_mr: "पांढरकवडा",
          villages: [
            { name: "Pandharkawada", name_mr: "पांढरकवडा" }
          ]
        }
      }
    },
    
    // मराठवाडा
    aurangabad: {
      name: "Aurangabad (Chhatrapati Sambhajinagar)",
      name_mr: "औरंगाबाद (छत्रपती संभाजीनगर)",
      talukas: {
        aurangabad: {
          name: "Aurangabad",
          name_mr: "औरंगाबाद",
          villages: [
            { name: "Chikalthana", name_mr: "चिकलठाणा" },
            { name: "Waluj", name_mr: "वाळूज" },
            { name: "Padegaon", name_mr: "पडेगाव" },
            { name: "Harsul", name_mr: "हरसूल" }
          ]
        },
        gangapur: {
          name: "Gangapur",
          name_mr: "गंगापूर",
          villages: [
            { name: "Gangapur", name_mr: "गंगापूर" },
            { name: "Shendra", name_mr: "शेंद्रा" },
            { name: "Bidkin", name_mr: "बिडकीन" }
          ]
        },
        kannad: {
          name: "Kannad",
          name_mr: "कन्नड",
          villages: [
            { name: "Kannad", name_mr: "कन्नड" }
          ]
        },
        khuldabad: {
          name: "Khuldabad",
          name_mr: "खुलताबाद",
          villages: [
            { name: "Khuldabad", name_mr: "खुलताबाद" }
          ]
        },
        sillod: {
          name: "Sillod",
          name_mr: "सिल्लोड",
          villages: [
            { name: "Sillod", name_mr: "सिल्लोड" }
          ]
        },
        vaijapur: {
          name: "Vaijapur",
          name_mr: "वैजापूर",
          villages: [
            { name: "Vaijapur", name_mr: "वैजापूर" }
          ]
        },
        paithan: {
          name: "Paithan",
          name_mr: "पैठण",
          villages: [
            { name: "Paithan", name_mr: "पैठण" }
          ]
        },
        phulambri: {
          name: "Phulambri",
          name_mr: "फुलंब्री",
          villages: [
            { name: "Phulambri", name_mr: "फुलंब्री" }
          ]
        },
        soygaon: {
          name: "Soygaon",
          name_mr: "सोयगाव",
          villages: [
            { name: "Soygaon", name_mr: "सोयगाव" }
          ]
        }
      }
    },
    jalna: {
      name: "Jalna",
      name_mr: "जालना",
      talukas: {
        jalna: {
          name: "Jalna",
          name_mr: "जालना",
          villages: [
            { name: "Jalna", name_mr: "जालना" }
          ]
        },
        badnapur: {
          name: "Badnapur",
          name_mr: "बदनापूर",
          villages: [
            { name: "Badnapur", name_mr: "बदनापूर" }
          ]
        },
        bhokardan: {
          name: "Bhokardan",
          name_mr: "भोकरदन",
          villages: [
            { name: "Bhokardan", name_mr: "भोकरदन" }
          ]
        },
        ambad: {
          name: "Ambad",
          name_mr: "अंबड",
          villages: [
            { name: "Ambad", name_mr: "अंबड" }
          ]
        },
        mantha: {
          name: "Mantha",
          name_mr: "मंठा",
          villages: [
            { name: "Mantha", name_mr: "मंठा" }
          ]
        },
        partur: {
          name: "Partur",
          name_mr: "परतूर",
          villages: [
            { name: "Partur", name_mr: "परतूर" }
          ]
        },
        ghansawangi: {
          name: "Ghansawangi",
          name_mr: "घनसावंगी",
          villages: [
            { name: "Ghansawangi", name_mr: "घनसावंगी" }
          ]
        },
        jafrabad: {
          name: "Jafrabad",
          name_mr: "जाफराबाद",
          villages: [
            { name: "Jafrabad", name_mr: "जाफराबाद" }
          ]
        }
      }
    },
    parbhani: {
      name: "Parbhani",
      name_mr: "परभणी",
      talukas: {
        parbhani: {
          name: "Parbhani",
          name_mr: "परभणी",
          villages: [
            { name: "Parbhani", name_mr: "परभणी" }
          ]
        }
      }
    },
    hingoli: {
      name: "Hingoli",
      name_mr: "हिंगोली",
      talukas: {
        hingoli: {
          name: "Hingoli",
          name_mr: "हिंगोली",
          villages: [
            { name: "Hingoli", name_mr: "हिंगोली" }
          ]
        },
        kalamnuri: {
          name: "Kalamnuri",
          name_mr: "कळमनुरी",
          villages: [
            { name: "Kalamnuri", name_mr: "कळमनुरी" }
          ]
        },
        sengaon: {
          name: "Sengaon",
          name_mr: "सेनगाव",
          villages: [
            { name: "Sengaon", name_mr: "सेनगाव" }
          ]
        },
        basmat: {
          name: "Basmat",
          name_mr: "बसमत",
          villages: [
            { name: "Basmat", name_mr: "बसमत" }
          ]
        },
        aundha_nagnath: {
          name: "Aundha Nagnath",
          name_mr: "औंढा नागनाथ",
          villages: [
            { name: "Aundha Nagnath", name_mr: "औंढा नागनाथ" }
          ]
        }
      }
    },
    nanded: {
      name: "Nanded",
      name_mr: "नांदेड",
      talukas: {
        nanded: {
          name: "Nanded",
          name_mr: "नांदेड",
          villages: [
            { name: "Nanded", name_mr: "नांदेड" }
          ]
        },
        bhokar: {
          name: "Bhokar",
          name_mr: "भोकर",
          villages: [
            { name: "Bhokar", name_mr: "भोकर" }
          ]
        },
        deglur: {
          name: "Deglur",
          name_mr: "देगलूर",
          villages: [
            { name: "Deglur", name_mr: "देगलूर" }
          ]
        },
        mukhed: {
          name: "Mukhed",
          name_mr: "मुक्केड",
          villages: [
            { name: "Mukhed", name_mr: "मुक्केड" }
          ]
        },
        hadgaon: {
          name: "Hadgaon",
          name_mr: "हदगाव",
          villages: [
            { name: "Hadgaon", name_mr: "हदगाव" }
          ]
        },
        umri: {
          name: "Umri",
          name_mr: "उमरी",
          villages: [
            { name: "Umri", name_mr: "उमरी" }
          ]
        },
        kinwat: {
          name: "Kinwat",
          name_mr: "किनवट",
          villages: [
            { name: "Kinwat", name_mr: "किनवट" }
          ]
        },
        mahur: {
          name: "Mahur",
          name_mr: "माहूर",
          villages: [
            { name: "Mahur", name_mr: "माहूर" }
          ]
        },
        biloli: {
          name: "Biloli",
          name_mr: "बिलोली",
          villages: [
            { name: "Biloli", name_mr: "बिलोली" }
          ]
        },
        dharmabad: {
          name: "Dharmabad",
          name_mr: "धर्माबाद",
          villages: [
            { name: "Dharmabad", name_mr: "धर्माबाद" }
          ]
        },
        loha: {
          name: "Loha",
          name_mr: "लोहा",
          villages: [
            { name: "Loha", name_mr: "लोहा" }
          ]
        },
        kandhar: {
          name: "Kandhar",
          name_mr: "कंधार",
          villages: [
            { name: "Kandhar", name_mr: "कंधार" }
          ]
        },
        ardhapur: {
          name: "Ardhapur",
          name_mr: "अर्धापूर",
          villages: [
            { name: "Ardhapur", name_mr: "अर्धापूर" }
          ]
        },
        mudkhed: {
          name: "Mudkhed",
          name_mr: "मुदखेड",
          villages: [
            { name: "Mudkhed", name_mr: "मुदखेड" }
          ]
        },
        naigaon: {
          name: "Naigaon",
          name_mr: "नायगाव",
          villages: [
            { name: "Naigaon", name_mr: "नायगाव" }
          ]
        },
        himayatnagar: {
          name: "Himayatnagar",
          name_mr: "हिमायतनगर",
          villages: [
            { name: "Himayatnagar", name_mr: "हिमायतनगर" }
          ]
        }
      }
    },
    latur: {
      name: "Latur",
      name_mr: "लातूर",
      talukas: {
        latur: {
          name: "Latur",
          name_mr: "लातूर",
          villages: [
            { name: "Latur", name_mr: "लातूर" }
          ]
        },
        ausa: {
          name: "Ausa",
          name_mr: "औसा",
          villages: [
            { name: "Ausa", name_mr: "औसा" }
          ]
        },
        nilanga: {
          name: "Nilanga",
          name_mr: "निलंगा",
          villages: [
            { name: "Nilanga", name_mr: "निलंगा" }
          ]
        },
        udgir: {
          name: "Udgir",
          name_mr: "उदगीर",
          villages: [
            { name: "Udgir", name_mr: "उदगीर" }
          ]
        },
        ahmadpur: {
          name: "Ahmadpur",
          name_mr: "अहमदपूर",
          villages: [
            { name: "Ahmadpur", name_mr: "अहमदपूर" }
          ]
        },
        renapur: {
          name: "Renapur",
          name_mr: "रेणापूर",
          villages: [
            { name: "Renapur", name_mr: "रेणापूर" }
          ]
        },
        devani: {
          name: "Devani",
          name_mr: "देवणी",
          villages: [
            { name: "Devani", name_mr: "देवणी" }
          ]
        },
        chakur: {
          name: "Chakur",
          name_mr: "चाकूर",
          villages: [
            { name: "Chakur", name_mr: "चाकूर" }
          ]
        },
        shirur_anantpal: {
          name: "Shirur Anantpal",
          name_mr: "शिरूर अनंतपाळ",
          villages: [
            { name: "Shirur Anantpal", name_mr: "शिरूर अनंतपाळ" }
          ]
        },
        jalkot: {
          name: "Jalkot",
          name_mr: "जळकोट",
          villages: [
            { name: "Jalkot", name_mr: "जळकोट" }
          ]
        }
      }
    },
    beed: {
      name: "Beed",
      name_mr: "बीड",
      talukas: {
        beed: {
          name: "Beed",
          name_mr: "बीड",
          villages: [
            { name: "Beed", name_mr: "बीड" }
          ]
        }
      }
    },
    osmanabad: {
      name: "Osmanabad (Dharashiv)",
      name_mr: "उस्मानाबाद (धाराशिव)",
      talukas: {
        osmanabad: {
          name: "Osmanabad",
          name_mr: "उस्मानाबाद",
          villages: [
            { name: "Osmanabad", name_mr: "उस्मानाबाद" }
          ]
        }
      }
    },
    
    // पश्चिम महाराष्ट्र / मध्य महाराष्ट्र
    ahmednagar: {
      name: "Ahmednagar",
      name_mr: "अहमदनगर",
      talukas: {
        ahmednagar: {
          name: "Ahmednagar",
          name_mr: "नगर",
          villages: [
            { name: "Ahmednagar", name_mr: "अहमदनगर" },
            { name: "Bhingar", name_mr: "भिंगार" },
            { name: "Savedi", name_mr: "सावेडी" }
          ]
        },
        shevgaon: {
          name: "Shevgaon",
          name_mr: "शेवगाव",
          villages: [
            { name: "Shevgaon", name_mr: "शेवगाव" }
          ]
        },
        pathardi: {
          name: "Pathardi",
          name_mr: "पाथर्डी",
          villages: [
            { name: "Pathardi", name_mr: "पाथर्डी" }
          ]
        },
        parner: {
          name: "Parner",
          name_mr: "पारनेर",
          villages: [
            { name: "Parner", name_mr: "पारनेर" }
          ]
        },
        sangamner: {
          name: "Sangamner",
          name_mr: "संगमनेर",
          villages: [
            { name: "Sangamner", name_mr: "संगमनेर" },
            { name: "Abhalwadi", name_mr: "अभलवाडी" },
            { name: "Ajampur", name_mr: "अजमपूर" },
            { name: "Akalapur", name_mr: "अकलापूर" },
            { name: "Ambhore", name_mr: "अंभोरे" },
            { name: "Ambidumala", name_mr: "अंबीडुमाळा" },
            { name: "Ambikhalsa", name_mr: "अंबीखळसा" },
            { name: "Amlewadi", name_mr: "आमलेवाडी" },
            { name: "Ashwi Bk", name_mr: "आश्वी बु." },
            { name: "Ashwi Kd", name_mr: "आश्वी खु." },
            { name: "Aurangpur", name_mr: "औरंगपूर" },
            { name: "Balapur", name_mr: "बालापूर" },
            { name: "Bambalewadi", name_mr: "बांबळेवाडी" },
            { name: "Bhojdari", name_mr: "भोजदरी" },
            { name: "Birewadi", name_mr: "बिरेवाडी" },
            { name: "Borbanwadi", name_mr: "बोरबनवाडी" },
            { name: "Bota", name_mr: "बोटा" },
            { name: "Chandanapuri", name_mr: "चंदनपुरी" },
            { name: "Chanegaon", name_mr: "चणेगाव" },
            { name: "Chikani", name_mr: "चिकणी" },
            { name: "Chikhali", name_mr: "चिखली" },
            { name: "Chincholi Gurav", name_mr: "चिंचोली गुरव" },
            { name: "Chinchapur Bk", name_mr: "चिंचापूर बु." },
            { name: "Chinchapur Kd", name_mr: "चिंचापूर खु." },
            { name: "Chor Kauthe", name_mr: "चोर कौठे" },
            { name: "Dadh Khurd", name_mr: "दढ खुर्द" },
            { name: "Darewadi", name_mr: "दरेवाडी" },
            { name: "Dawas", name_mr: "दवस" },
            { name: "Devgoan", name_mr: "देवगाव" },
            { name: "Devkavthe", name_mr: "देवकवठे" },
            { name: "Dhad Khurd", name_mr: "धाड खुर्द" },
            { name: "Dhandarphal Bk", name_mr: "धांदरफळ बु." },
            { name: "Dhandarphal Kd", name_mr: "धांदरफळ खु." },
            { name: "Digras", name_mr: "दिग्रस" },
            { name: "Dolasane", name_mr: "डोलसणे" },
            { name: "Devpur", name_mr: "देवपूर" },
            { name: "Ghargon", name_mr: "घारगाव" },
            { name: "Ghulewadi", name_mr: "घुलेवाडी" },
            { name: "Gunjalwadi", name_mr: "गुंजाळवाडी" },
            { name: "Ganeshwadi", name_mr: "गणेशवाडी" },
            { name: "Gabhanawadi", name_mr: "गाभणावाडी" },
            { name: "Godasewadi", name_mr: "गोडसेवाडी" },
            { name: "Hangewadi", name_mr: "हांगेवाडी" },
            { name: "Hasanabad", name_mr: "हसनाबाद" },
            { name: "Hiwargaon Pathar", name_mr: "हिवरगाव पठार" },
            { name: "Hiwargaon Pawasa", name_mr: "हिवरगाव पवासा" },
            { name: "Jakhori", name_mr: "जाखोरी" },
            { name: "Jambhul Wadi", name_mr: "जांभूळ वाडी" },
            { name: "Jambut Bk", name_mr: "जांबूट बु." },
            { name: "Jambut Kh", name_mr: "जांबूट खु." },
            { name: "Jawale Baleshwar", name_mr: "जवळे बालेश्वर" },
            { name: "Jawale Kadlag", name_mr: "जवळे कडलग" },
            { name: "Jorvee", name_mr: "जोरवे" },
            { name: "Junegaon", name_mr: "जुनेगाव" },
            { name: "Kanjapur", name_mr: "कंजापूर" },
            { name: "Kankapur", name_mr: "कंकापूर" },
            { name: "Kanoli", name_mr: "कनोली" },
            { name: "Karjulepathar", name_mr: "कर्जुलेपठार" },
            { name: "Karule", name_mr: "करुळे" },
            { name: "Kasaradumala", name_mr: "कसारडुमाळा" },
            { name: "Kasare", name_mr: "कसारे" },
            { name: "Khali", name_mr: "खळी" },
            { name: "Khambe", name_mr: "खांबे" },
            { name: "Khandarmalwadi", name_mr: "खंडरमालवाडी" },
            { name: "Khandgoan", name_mr: "खंडगाव" },
            { name: "Kharadi", name_mr: "खराडी" },
            { name: "Khare", name_mr: "खरे" },
            { name: "Kharshinde", name_mr: "खरशिंदे" },
            { name: "Kokangaon", name_mr: "कोकणगाव" },
            { name: "Kolhewadi", name_mr: "कोल्हेवाडी" },
            { name: "Kolwade", name_mr: "कोलवडे" },
            { name: "Konchi", name_mr: "कोंची" },
            { name: "Khed", name_mr: "खेड" },
            { name: "Kothe Bk", name_mr: "कोठे बु." },
            { name: "Kauthe Dhandarphal", name_mr: "कौठे धांदरफळ" },
            { name: "Kauthe Kamleshwar", name_mr: "कौठे कमलेश्वर" },
            { name: "Kothe Kd", name_mr: "कोठे खु." },
            { name: "Kouthe Malkapur", name_mr: "कौठे मलकापूर" },
            { name: "Kuran", name_mr: "कुरण" },
            { name: "Kurkundi", name_mr: "कुरकुंडी" },
            { name: "Kurkutwadi", name_mr: "कुरकुटवाडी" },
            { name: "Kakadwadi", name_mr: "काकडवाडी" },
            { name: "Lohare", name_mr: "लोहारे" },
            { name: "Manchi", name_mr: "मांची" },
            { name: "Mahalwadi", name_mr: "महालवाडी" },
            { name: "Maldad", name_mr: "मलदाड" },
            { name: "Malegoan Haveli", name_mr: "माळेगाव हवेली" },
            { name: "Malegoan Pathar", name_mr: "माळेगाव पठार" },
            { name: "Malewadi", name_mr: "माळेवाडी" },
            { name: "Malunje", name_mr: "मालुंजे" },
            { name: "Mandve Bk", name_mr: "मांडवे बु." },
            { name: "Manglapur", name_mr: "मंगलापूर" },
            { name: "Manoli", name_mr: "मनोली" },
            { name: "Mendhawan", name_mr: "मेंढवण" },
            { name: "Mhaswandi", name_mr: "म्हसवंडी" },
            { name: "Mirpur", name_mr: "मिरपूर" },
            { name: "Mirzapur", name_mr: "मिर्झापूर" },
            { name: "Nanduri Dumala", name_mr: "नांदुरी डुमाळा" },
            { name: "Nandurkhandrmal", name_mr: "नांदुरखंडरमाळ" },
            { name: "Nilwande", name_mr: "निळवंडे" },
            { name: "Nimaj", name_mr: "निमज" },
            { name: "Nimble", name_mr: "निंबळे" },
            { name: "Nimgoan Bhojapur", name_mr: "निमगाव भोजापूर" },
            { name: "Nimgoan Bk", name_mr: "निमगाव बु." },
            { name: "Nimgoan Kd", name_mr: "निमगाव खु." },
            { name: "Nimgaon Tembhi", name_mr: "निमगाव टेंभी" },
            { name: "Nimgoanjali", name_mr: "निमगावजळी" },
            { name: "Nimon", name_mr: "निमोण" },
            { name: "Nannaj Dumala", name_mr: "नान्नज डुमाळा" },
            { name: "Ozer Bk", name_mr: "ओझर बु." },
            { name: "Ozer Kd", name_mr: "ओझर खु." },
            { name: "Palaskhede", name_mr: "पळसखेडे" },
            { name: "Panodi", name_mr: "पानोडी" },
            { name: "Paregaon Bk", name_mr: "पारेगाव बु." },
            { name: "Paregoan Kd", name_mr: "पारेगाव खु." },
            { name: "Pemgiri", name_mr: "पेमगिरी" },
            { name: "Pimpalgaon Konzira", name_mr: "पिंपळगाव कोंझिरा" },
            { name: "Pimpalgaon Matha", name_mr: "पिंपळगाव माथा" },
            { name: "Pimpalgaon Depa", name_mr: "पिंपळगाव देपा" },
            { name: "Pimpalgaon Khand", name_mr: "पिंपळगाव खंड" },
            { name: "Pimparne", name_mr: "पिंपरणे" },
            { name: "Pimple", name_mr: "पिंपळे" },
            { name: "Pimpri Louki Azampur", name_mr: "पिंपरी लौकी अजमपूर" },
            { name: "Pokhari Baleshwar", name_mr: "पोखरी बालेश्वर" },
            { name: "Pokhari Haveli", name_mr: "पोखरी हवेली" },
            { name: "Pratappur", name_mr: "प्रतापूर" },
            { name: "Rahimpur Mal", name_mr: "रहिमपूर माळ" },
            { name: "Rahimpur Khale Gaon", name_mr: "रहिमपूर खाले गाव" },
            { name: "Rajapur", name_mr: "राजापूर" },
            { name: "Rankhambwadi", name_mr: "रानखांबवाडी" },
            { name: "Rayate", name_mr: "रायते" },
            { name: "Rayatewadi", name_mr: "रायतेवाडी" },
            { name: "Sadatpur", name_mr: "सादतपूर" },
            { name: "Sakur", name_mr: "साकुर" },
            { name: "Samnapur", name_mr: "सामनापूर" },
            { name: "Sangamner Kd", name_mr: "संगमनेर खु." },
            { name: "Sangvi", name_mr: "सांगवी" },
            { name: "Sarole Pathar", name_mr: "सारोळे पठार" },
            { name: "Sawarchol", name_mr: "सावरचोळ" },
            { name: "Sawargoan Ghule", name_mr: "सावरगाव घुले" },
            { name: "Sawargoan Tal", name_mr: "सावरगाव ताल" },
            { name: "Saykhindi", name_mr: "सायखिंडी" },
            { name: "Shedgoan", name_mr: "शेडगाव" },
            { name: "Shiblapur", name_mr: "शिबलापूर" },
            { name: "Shindodi", name_mr: "शिंदोडी" },
            { name: "Shirapur", name_mr: "शिरापूर" },
            { name: "Shirasgoan Dhupe", name_mr: "शिरसगाव धुपे" },
            { name: "Shindewadi", name_mr: "शिंदेवाडी" },
            { name: "Sukewadi", name_mr: "सुकेवाडी" },
            { name: "Talegoan", name_mr: "तळेगाव" },
            { name: "Tisgoan", name_mr: "तिसगाव" },
            { name: "Tigoan", name_mr: "टिगाव" },
            { name: "Umbri Balapur", name_mr: "उंब्री बालापूर" },
            { name: "Velhale", name_mr: "वेल्हाळे" },
            { name: "Wadgoan Landaga", name_mr: "वडगाव लांडगा" },
            { name: "Wadgoan Pan", name_mr: "वडगाव पान" },
            { name: "Wadzari Bk", name_mr: "वडझरी बु." },
            { name: "Wadzari Kd", name_mr: "वडझरी खु." },
            { name: "Waghapur", name_mr: "वाघापूर" },
            { name: "Wankute", name_mr: "वानकुटे" },
            { name: "Warudi Pathar", name_mr: "वारुडी पठार" },
            { name: "Warvandi", name_mr: "वारवंडी" },
            { name: "Zarekati", name_mr: "झरेकाटी" },
            { name: "Zole", name_mr: "झोळे" }
          ]
        },
        kopargaon: {
          name: "Kopargaon",
          name_mr: "कोपरगाव",
          villages: [
            { name: "Kopargaon", name_mr: "कोपरगाव" }
          ]
        },
        akole: {
          name: "Akole",
          name_mr: "अकोले",
          villages: [
            { name: "Akole", name_mr: "अकोले" }
          ]
        },
        shrirampur: {
          name: "Shrirampur",
          name_mr: "श्रीरामपूर",
          villages: [
            { name: "Shrirampur", name_mr: "श्रीरामपूर" }
          ]
        },
        nevasa: {
          name: "Nevasa",
          name_mr: "नेवासा",
          villages: [
            { name: "Nevasa", name_mr: "नेवासा" }
          ]
        },
        rahata: {
          name: "Rahata",
          name_mr: "राहाता",
          villages: [
            { name: "Rahata", name_mr: "राहाता" }
          ]
        },
        rahuri: {
          name: "Rahuri",
          name_mr: "राहुरी",
          villages: [
            { name: "Rahuri", name_mr: "राहुरी" }
          ]
        },
        shrigonda: {
          name: "Shrigonda",
          name_mr: "श्रीगोंदा",
          villages: [
            { name: "Shrigonda", name_mr: "श्रीगोंदा" }
          ]
        },
        karjat: {
          name: "Karjat",
          name_mr: "कर्जत",
          villages: [
            { name: "Karjat", name_mr: "कर्जत" }
          ]
        },
        jamkhed: {
          name: "Jamkhed",
          name_mr: "जामखेड",
          villages: [
            { name: "Jamkhed", name_mr: "जामखेड" }
          ]
        }
      }
    },
    pune: {
      name: "Pune",
      name_mr: "पुणे",
      talukas: {
        pune_city: {
          name: "Pune City",
          name_mr: "पुणे शहर",
          villages: [
            { name: "Shivajinagar", name_mr: "शिवाजीनगर" },
            { name: "Swargate", name_mr: "स्वारगेट" },
            { name: "Deccan", name_mr: "डेक्कन" },
            { name: "Hadapsar", name_mr: "हडपसर" },
            { name: "Khadki", name_mr: "खडकी" }
          ]
        },
        haveli: {
          name: "Haveli",
          name_mr: "हवेली",
          villages: [
            { name: "Kothrud", name_mr: "कोथरूड" },
            { name: "Warje", name_mr: "वारजे" },
            { name: "Baner", name_mr: "बाणेर" },
            { name: "Pashan", name_mr: "पाषाण" },
            { name: "Shivane", name_mr: "शिवणे" }
          ]
        },
        mulshi: {
          name: "Mulshi",
          name_mr: "मुळशी",
          villages: [
            { name: "Hinjewadi", name_mr: "हिंजेवाडी" },
            { name: "Marunji", name_mr: "मारुंजी" },
            { name: "Nande", name_mr: "नांदे" },
            { name: "Pirangut", name_mr: "पिरंगुट" },
            { name: "Lavale", name_mr: "लवळे" }
          ]
        },
        maval: {
          name: "Maval",
          name_mr: "मावळ",
          villages: [
            { name: "Talegaon", name_mr: "तळेगाव" },
            { name: "Vadgaon", name_mr: "वडगाव" },
            { name: "Lonavala", name_mr: "लोणावळा" },
            { name: "Kamshet", name_mr: "कामशेत" },
            { name: "Kanhe", name_mr: "कान्हे" }
          ]
        },
        khed: {
          name: "Khed",
          name_mr: "खेड",
          villages: [
            { name: "Khed", name_mr: "खेड" },
            { name: "Chakan", name_mr: "चाकण" }
          ]
        },
        junnar: {
          name: "Junnar",
          name_mr: "जुन्नर",
          villages: [
            { name: "Junnar", name_mr: "जुन्नर" }
          ]
        },
        ambegaon: {
          name: "Ambegaon",
          name_mr: "आंबेगाव",
          villages: [
            { name: "Ambegaon", name_mr: "आंबेगाव" }
          ]
        },
        shirur: {
          name: "Shirur",
          name_mr: "शिरूर",
          villages: [
            { name: "Shirur", name_mr: "शिरूर" },
            { name: "Ranjangaon", name_mr: "रांजणगाव" }
          ]
        },
        daund: {
          name: "Daund",
          name_mr: "दौंड",
          villages: [
            { name: "Daund", name_mr: "दौंड" }
          ]
        },
        baramati: {
          name: "Baramati",
          name_mr: "बारामती",
          villages: [
            { name: "Baramati", name_mr: "बारामती" }
          ]
        },
        indapur: {
          name: "Indapur",
          name_mr: "इंदापूर",
          villages: [
            { name: "Indapur", name_mr: "इंदापूर" }
          ]
        },
        bhor: {
          name: "Bhor",
          name_mr: "भोर",
          villages: [
            { name: "Bhor", name_mr: "भोर" }
          ]
        },
        velhe: {
          name: "Velhe",
          name_mr: "वेल्हे",
          villages: [
            { name: "Velhe", name_mr: "वेल्हे" }
          ]
        },
        purandar: {
          name: "Purandar",
          name_mr: "पुरंदर",
          villages: [
            { name: "Saswad", name_mr: "सासवड" },
            { name: "Jejuri", name_mr: "जेजुरी" }
          ]
        }
      }
    },
    satara: {
      name: "Satara",
      name_mr: "सातारा",
      talukas: {
        satara: {
          name: "Satara",
          name_mr: "सातारा",
          villages: [
            { name: "Satara", name_mr: "सातारा" }
          ]
        }
      }
    },
    sangli: {
      name: "Sangli",
      name_mr: "सांगली",
      talukas: {
        sangli: {
          name: "Sangli",
          name_mr: "सांगली",
          villages: [
            { name: "Sangli", name_mr: "सांगली" }
          ]
        }
      }
    },
    kolhapur: {
      name: "Kolhapur",
      name_mr: "कोल्हापूर",
      talukas: {
        kolhapur: {
          name: "Kolhapur",
          name_mr: "कोल्हापूर",
          villages: [
            { name: "Kolhapur", name_mr: "कोल्हापूर" }
          ]
        },
        karvir: {
          name: "Karvir",
          name_mr: "करवीर",
          villages: [
            { name: "Karvir", name_mr: "करवीर" }
          ]
        },
        hatkanangale: {
          name: "Hatkanangale",
          name_mr: "हातकणंगले",
          villages: [
            { name: "Hatkanangale", name_mr: "हातकणंगले" }
          ]
        },
        panhala: {
          name: "Panhala",
          name_mr: "पन्हाळा",
          villages: [
            { name: "Panhala", name_mr: "पन्हाळा" }
          ]
        },
        gaganbavda: {
          name: "Gaganbavda",
          name_mr: "गगनबावडा",
          villages: [
            { name: "Gaganbavda", name_mr: "गगनबावडा" }
          ]
        },
        shahuwadi: {
          name: "Shahuwadi",
          name_mr: "शाहूवाडी",
          villages: [
            { name: "Shahuwadi", name_mr: "शाहूवाडी" }
          ]
        },
        radhanagari: {
          name: "Radhanagari",
          name_mr: "राधानगरी",
          villages: [
            { name: "Radhanagari", name_mr: "राधानगरी" }
          ]
        },
        bhudargad: {
          name: "Bhudargad",
          name_mr: "भुदरगड",
          villages: [
            { name: "Bhudargad", name_mr: "भुदरगड" }
          ]
        },
        ajara: {
          name: "Ajara",
          name_mr: "आजरा",
          villages: [
            { name: "Ajara", name_mr: "आजरा" }
          ]
        },
        chandgad: {
          name: "Chandgad",
          name_mr: "चंदगड",
          villages: [
            { name: "Chandgad", name_mr: "चंदगड" }
          ]
        },
        kagal: {
          name: "Kagal",
          name_mr: "कागल",
          villages: [
            { name: "Kagal", name_mr: "कागल" }
          ]
        },
        shirol: {
          name: "Shirol",
          name_mr: "शिरोळ",
          villages: [
            { name: "Shirol", name_mr: "शिरोळ" }
          ]
        }
      }
    },
    solapur: {
      name: "Solapur",
      name_mr: "सोलापूर",
      talukas: {
        solapur: {
          name: "Solapur",
          name_mr: "सोलापूर",
          villages: [
            { name: "Solapur", name_mr: "सोलापूर" }
          ]
        }
      }
    },
    
    // उत्तर महाराष्ट्र (खान्देश)
    nashik: {
      name: "Nashik",
      name_mr: "नाशिक",
      talukas: {
        nashik: {
          name: "Nashik",
          name_mr: "नाशिक",
          villages: [
            { name: "Panchavati", name_mr: "पंचवटी" },
            { name: "Satpur", name_mr: "सातपूर" },
            { name: "Nashik Road", name_mr: "नाशिक रोड" },
            { name: "Deolali", name_mr: "देवळाली" },
            { name: "Mhasrul", name_mr: "म्हसरूळ" }
          ]
        },
        igatpuri: {
          name: "Igatpuri",
          name_mr: "इगतपुरी",
          villages: [
            { name: "Igatpuri", name_mr: "इगतपुरी" },
            { name: "Ghoti", name_mr: "घोटी" }
          ]
        },
        sinnar: {
          name: "Sinnar",
          name_mr: "सिन्नर",
          villages: [
            { name: "Sinnar", name_mr: "सिन्नर" },
            { name: "Wavi", name_mr: "वावी" },
            { name: "Musalgaon", name_mr: "मुसळगाव" }
          ]
        },
        yeola: {
          name: "Yeola",
          name_mr: "येवला",
          villages: [
            { name: "Yeola", name_mr: "येवला" }
          ]
        },
        niphad: {
          name: "Niphad",
          name_mr: "निफाड",
          villages: [
            { name: "Niphad", name_mr: "निफाड" },
            { name: "Lasalgaon", name_mr: "लासलगाव" }
          ]
        },
        dindori: {
          name: "Dindori",
          name_mr: "दिंडोरी",
          villages: [
            { name: "Dindori", name_mr: "दिंडोरी" }
          ]
        },
        trimbakeshwar: {
          name: "Trimbakeshwar",
          name_mr: "त्र्यंबकेश्वर",
          villages: [
            { name: "Trimbakeshwar", name_mr: "त्र्यंबकेश्वर" }
          ]
        },
        chandwad: {
          name: "Chandwad",
          name_mr: "चांदवड",
          villages: [
            { name: "Chandwad", name_mr: "चांदवड" }
          ]
        },
        deola: {
          name: "Deola",
          name_mr: "देवळा",
          villages: [
            { name: "Deola", name_mr: "देवळा" }
          ]
        },
        baglan: {
          name: "Baglan / Satana",
          name_mr: "बागलाण / सटाणा",
          villages: [
            { name: "Satana", name_mr: "सटाणा" }
          ]
        },
        malegaon: {
          name: "Malegaon",
          name_mr: "मालेगाव",
          villages: [
            { name: "Malegaon", name_mr: "मालेगाव" }
          ]
        },
        nandgaon: {
          name: "Nandgaon",
          name_mr: "नांदगाव",
          villages: [
            { name: "Nandgaon", name_mr: "नांदगाव" }
          ]
        },
        pimpalgaon: {
          name: "Pimpalgaon Baswant",
          name_mr: "पिंपळगांव",
          villages: [
            { name: "Pimpalgaon Baswant", name_mr: "पिंपळगांव" }
          ]
        },
        peth: {
          name: "Peth",
          name_mr: "पेठ",
          villages: [
            { name: "Peth", name_mr: "पेठ" }
          ]
        },
        surgana: {
          name: "Surgana",
          name_mr: "सुरगाणा",
          villages: [
            { name: "Surgana", name_mr: "सुरगाणा" }
          ]
        }
      }
    },
    dhule: {
      name: "Dhule",
      name_mr: "धुळे",
      talukas: {
        dhule: {
          name: "Dhule",
          name_mr: "धुळे",
          villages: [
            { name: "Dhule", name_mr: "धुळे" }
          ]
        }
      }
    },
    jalgaon: {
      name: "Jalgaon",
      name_mr: "जळगाव",
      talukas: {
        jalgaon: {
          name: "Jalgaon",
          name_mr: "जळगाव",
          villages: [
            { name: "Jalgaon", name_mr: "जळगाव" }
          ]
        }
      }
    },
    nandurbar: {
      name: "Nandurbar",
      name_mr: "नंदुरबार",
      talukas: {
        nandurbar: {
          name: "Nandurbar",
          name_mr: "नंदुरबार",
          villages: [
            { name: "Nandurbar", name_mr: "नंदुरबार" }
          ]
        }
      }
    },
    
    // कोकण
    mumbai_city: {
      name: "Mumbai City",
      name_mr: "मुंबई शहर",
      talukas: {
        mumbai_city: {
          name: "Mumbai City",
          name_mr: "मुंबई शहर",
          villages: [
            { name: "Colaba", name_mr: "कुलाबा" },
            { name: "Fort", name_mr: "फोर्ट" },
            { name: "Marine Lines", name_mr: "मरीन लाइन्स" },
            { name: "Churchgate", name_mr: "चर्चगेट" },
            { name: "Nariman Point", name_mr: "नरिमन पॉइंट" }
          ]
        }
      }
    },
    mumbai_suburban: {
      name: "Mumbai Suburban",
      name_mr: "मुंबई उपनगर",
      talukas: {
        mumbai_suburban: {
          name: "Mumbai Suburban",
          name_mr: "मुंबई उपनगर",
          villages: [
            { name: "Andheri", name_mr: "अंधेरी" },
            { name: "Bandra", name_mr: "बांद्रा" },
            { name: "Borivali", name_mr: "बोरिवली" },
            { name: "Goregaon", name_mr: "गोरेगाव" },
            { name: "Malad", name_mr: "मालाड" }
          ]
        }
      }
    },
    thane: {
      name: "Thane",
      name_mr: "ठाणे",
      talukas: {
        thane: {
          name: "Thane",
          name_mr: "ठाणे",
          villages: [
            { name: "Thane", name_mr: "ठाणे" }
          ]
        }
      }
    },
    palghar: {
      name: "Palghar",
      name_mr: "पालघर",
      talukas: {
        palghar: {
          name: "Palghar",
          name_mr: "पालघर",
          villages: [
            { name: "Palghar", name_mr: "पालघर" }
          ]
        }
      }
    },
    raigad: {
      name: "Raigad",
      name_mr: "रायगड",
      talukas: {
        raigad: {
          name: "Raigad",
          name_mr: "रायगड",
          villages: [
            { name: "Raigad", name_mr: "रायगड" }
          ]
        }
      }
    },
    ratnagiri: {
      name: "Ratnagiri",
      name_mr: "रत्नागिरी",
      talukas: {
        ratnagiri: {
          name: "Ratnagiri",
          name_mr: "रत्नागिरी",
          villages: [
            { name: "Ratnagiri", name_mr: "रत्नागिरी" }
          ]
        }
      }
    },
    sindhudurg: {
      name: "Sindhudurg",
      name_mr: "सिंधुदुर्ग",
      talukas: {
        sindhudurg: {
          name: "Sindhudurg",
          name_mr: "सिंधुदुर्ग",
          villages: [
            { name: "Sindhudurg", name_mr: "सिंधुदुर्ग" }
          ]
        }
      }
    }
  }
};

// Helper functions to get lists
export const getDistrictsList = (language: 'en' | 'mr' = 'en') => {
  return Object.values(maharashtraLocations.districts).map(district => ({
    value: district.name.toLowerCase().replace(/\s+/g, '_'),
    label: language === 'en' ? district.name : district.name_mr
  }));
};

export const getTalukasList = (districtKey: string, language: 'en' | 'mr' = 'en') => {
  const district = Object.values(maharashtraLocations.districts).find(
    d => d.name.toLowerCase().replace(/\s+/g, '_') === districtKey
  );
  
  if (!district) return [];
  
  return Object.values(district.talukas).map(taluka => ({
    value: taluka.name.toLowerCase().replace(/\s+/g, '_'),
    label: language === 'en' ? taluka.name : taluka.name_mr
  }));
};

export const getVillagesList = (districtKey: string, talukaKey: string, language: 'en' | 'mr' = 'en') => {
  const district = Object.values(maharashtraLocations.districts).find(
    d => d.name.toLowerCase().replace(/\s+/g, '_') === districtKey
  );
  
  if (!district) return [];
  
  const taluka = Object.values(district.talukas).find(
    t => t.name.toLowerCase().replace(/\s+/g, '_') === talukaKey
  );
  
  if (!taluka) return [];
  
  return taluka.villages.map(village => ({
    value: village.name.toLowerCase().replace(/\s+/g, '_'),
    label: language === 'en' ? village.name : village.name_mr
  }));
};