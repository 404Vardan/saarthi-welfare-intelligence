# scripts/catalog_energy.py

def get_schemes():
    return [
        {
            'id': 'energy-saubhagya-240',
            'code': 'SAUBHAGYA',
            'name': 'Pradhan Mantri Sahaj Bijli Har Ghar Yojana (Saubhagya)',
            'short_name': 'Saubhagya Universal Electricity',
            'ministry': 'Ministry of Power',
            'state': 'All-India',
            'category': 'energy',
            'beneficiary_types': ['rural_poor', 'bpl', 'unelectrified_household'],
            'desc': 'Free electricity connection to all willing un-electrified rural households and poor urban households, including service cable, smart meter, single-point wiring, and LED lamp.',
            'benefit': '100% free electricity connection for poor households (Free meter, wiring, and LED lamp)',
            'quantum': 'Free Household Meter & Power Connection',
            'type': 'in_kind_and_services',
            'days': 15,
            'rules': [
                {'field': 'citizen.bpl_card', 'op': 'IN', 'value': [True, False], 'label': 'Un-electrified Household Resident', 'impact': 'critical'}
            ],
            'flatRules': {},
            'docs': ['Aadhaar Card', 'Ration Card / Address Proof', 'DISCOM Application Form'],
            'url': 'https://saubhagya.gov.in',
            'completeness': 'VERIFIED'
        },
        {
            'id': 'energy-ujala-led-241',
            'code': 'UJALA-LEDS',
            'name': 'Unnat Jyoti by Affordable LEDs for All (UJALA)',
            'short_name': 'UJALA Subsidized LED Bulbs',
            'ministry': 'Ministry of Power',
            'state': 'All-India',
            'category': 'energy',
            'beneficiary_types': ['all_citizens', 'electricity_consumer'],
            'desc': 'Distribution of high-efficiency 9W LED bulbs, 20W LED tube lights, and BEE 5-star energy-efficient ceiling fans at heavily subsidized prices (up to 70% below market retail) via DISCOMs.',
            'benefit': 'BEE 5-star energy bulbs and fans at subsidized rates saving up to ₹4,000 on annual electricity bills',
            'quantum': 'Subsidized 5-Star Energy Appliances',
            'type': 'in_kind_and_services',
            'days': 1,
            'rules': [
                {'field': 'citizen.occupation', 'op': 'IN', 'value': ['farmer', 'employed', 'salaried', 'self_employed', 'daily_wage', 'homemaker'], 'label': 'Domestic Electricity Consumer', 'impact': 'moderate'}
            ],
            'flatRules': {'occupation': ['farmer', 'employed', 'salaried', 'self_employed', 'daily_wage', 'homemaker']},
            'docs': ['Recent Electricity Bill', 'Aadhaar Card or Photo ID'],
            'url': 'https://ujala.gov.in',
            'completeness': 'VERIFIED'
        },
        {
            'id': 'energy-fame-pm-edrive-242',
            'code': 'PM-E-DRIVE',
            'name': 'PM Electric Drive Revolution in Innovative Vehicle Enhancement (PM E-DRIVE)',
            'short_name': 'PM E-DRIVE Electric Vehicle Subsidy',
            'ministry': 'Ministry of Heavy Industries',
            'state': 'All-India',
            'category': 'energy',
            'beneficiary_types': ['ev_buyer', 'youth', 'commuter'],
            'desc': 'Demand incentive subsidy up to ₹10,000 for electric two-wheelers (e-2W) and up to ₹50,000 for electric three-wheelers (e-3W) credited directly as upfront discount off vehicle showroom price.',
            'benefit': 'Upfront point-of-sale discount up to ₹10,000 on electric scooters / ₹50,000 on electric autos',
            'quantum': 'Up to ₹50,000 EV Demand Incentive Subsidy',
            'type': 'capital_subsidy',
            'days': 1,
            'rules': [
                {'field': 'citizen.age', 'op': 'GTE', 'value': 18, 'label': 'Age ≥ 18 Years with Valid Driving Licence', 'impact': 'critical'}
            ],
            'flatRules': {'age_min': 18},
            'docs': ['Aadhaar Card (e-KYC verified at dealership)', 'Driving Licence', 'PAN Card'],
            'url': 'https://heavyindustries.gov.in',
            'completeness': 'VERIFIED'
        },
        {
            'id': 'energy-satat-cbg-243',
            'code': 'SATAT-BIO-GAS',
            'name': 'Sustainable Alternative Towards Affordable Transportation (SATAT)',
            'short_name': 'SATAT Compressed Bio-Gas (CBG)',
            'ministry': 'Ministry of Petroleum and Natural Gas',
            'state': 'All-India',
            'category': 'energy',
            'beneficiary_types': ['entrepreneur', 'farmer_producer', 'business'],
            'desc': 'Commercial partnership scheme by PSU Oil Marketing Companies (IOCL, BPCL, HPCL) offering guaranteed commercial offtake agreements (at ₹54/kg) and capital subsidies up to ₹5 Crore for setting up CBG plants from agro-waste.',
            'benefit': 'Long-term 10-year guaranteed offtake agreement at fixed price + ₹5 Crore central subsidy',
            'quantum': 'Up to ₹5,00,00,000 Capital Subsidy & Guaranteed Buyback',
            'type': 'capital_subsidy',
            'days': 45,
            'rules': [
                {'field': 'citizen.occupation', 'op': 'IN', 'value': ['entrepreneur', 'business', 'farmer'], 'label': 'Agro-Energy Entrepreneur or FPO', 'impact': 'critical'}
            ],
            'flatRules': {'occupation': ['entrepreneur', 'business', 'farmer']},
            'docs': ['Detailed Project Feasibility Report', 'Land Title / Lease Agreement', 'Bank In-Principle Loan Sanction', 'Udyam Certificate'],
            'url': 'https://satat.co.in',
            'completeness': 'VERIFIED'
        },
        {
            'id': 'energy-solar-study-lamp-244',
            'code': 'SOLAR-STUDY-LAMP',
            'name': 'MNRE Solar Study Lamp Scheme for Rural Students',
            'short_name': 'Solar Study Lamp Scheme',
            'ministry': 'Ministry of New and Renewable Energy',
            'state': 'All-India',
            'category': 'energy',
            'beneficiary_types': ['students', 'rural_children'],
            'desc': 'Distribution and assembly of solar study lamps with high-efficiency LED lights and solar PV panels for school children in rural areas at a token beneficiary contribution of just ₹100.',
            'benefit': 'High illumination solar study lamp (worth ₹800) provided for just ₹100 token cost',
            'quantum': 'Subsidized Solar Study Lamp (₹100 cost)',
            'type': 'in_kind_and_services',
            'days': 7,
            'rules': [
                {'field': 'citizen.occupation', 'op': 'EQ', 'value': 'student', 'label': 'Enrolled School Student in Rural Block', 'impact': 'critical'},
                {'field': 'citizen.age', 'op': 'LTE', 'value': 18, 'label': 'Age ≤ 18 Years', 'impact': 'critical'}
            ],
            'flatRules': {'occupation': ['student'], 'age_max': 18},
            'docs': ['School ID Card / Bonafide Certificate', 'Aadhaar Card'],
            'url': 'https://mnre.gov.in',
            'completeness': 'VERIFIED'
        },
        {
            'id': 'energy-national-bioenergy-245',
            'code': 'BIOENERGY-PROGRAMME',
            'name': 'National Bioenergy Programme (Waste to Energy & Biomass Briquette)',
            'short_name': 'National Bioenergy Subsidy',
            'ministry': 'Ministry of New and Renewable Energy',
            'state': 'All-India',
            'category': 'energy',
            'beneficiary_types': ['farmer', 'entrepreneur', 'agro_industry'],
            'desc': 'Central Financial Assistance (CFA) up to ₹75 Lakh per MW for Waste-to-Energy projects and ₹9 Lakh per metric ton/hour capacity for biomass briquette and pellet manufacturing plants.',
            'benefit': 'Capital grant up to ₹75 Lakh/MW for energy recovery from agricultural waste and biomass',
            'quantum': 'Up to ₹75,00,000 / MW Central Financial Assistance',
            'type': 'capital_subsidy',
            'days': 60,
            'rules': [
                {'field': 'citizen.occupation', 'op': 'IN', 'value': ['business', 'farmer', 'entrepreneur'], 'label': 'Biomass Producer / Renewable Energy Developer', 'impact': 'critical'}
            ],
            'flatRules': {'occupation': ['business', 'farmer', 'entrepreneur']},
            'docs': ['Detailed Project Report', 'Pollution Control Board Consent', 'Bank Appraisal Note'],
            'url': 'https://mnre.gov.in',
            'completeness': 'VERIFIED'
        },
        {
            'id': 'energy-bee-star-appliance-246',
            'code': 'BEE-STAR-LABELLING',
            'name': 'Bureau of Energy Efficiency (BEE) Star Rating Scheme',
            'short_name': 'BEE 5-Star Energy Standards',
            'ministry': 'Ministry of Power',
            'state': 'All-India',
            'category': 'energy',
            'beneficiary_types': ['consumer', 'all_citizens'],
            'desc': 'Mandatory energy efficiency star labeling on appliances (ACs, refrigerators, water heaters, agricultural pump sets) enabling consumers to save up to 50% on utility electricity consumption.',
            'benefit': 'Certified reduction of 30% to 50% in electricity consumption across verified appliances',
            'quantum': 'Up to 50% Household Power Bill Reduction',
            'type': 'in_kind_and_services',
            'days': 1,
            'rules': [
                {'field': 'citizen.occupation', 'op': 'IN', 'value': ['employed', 'salaried', 'self_employed', 'farmer', 'business'], 'label': 'Retail Energy Consumer', 'impact': 'moderate'}
            ],
            'flatRules': {'occupation': ['employed', 'salaried', 'self_employed', 'farmer', 'business']},
            'docs': ['BEE Energy Rating Label on Appliance'],
            'url': 'https://beeindia.gov.in',
            'completeness': 'INFORMATIONAL_ONLY'
        },
        {
            'id': 'energy-green-hydrogen-247',
            'code': 'GREEN-HYDROGEN-MISSION',
            'name': 'National Green Hydrogen Mission (SIGHT Financial Incentives)',
            'short_name': 'Green Hydrogen SIGHT Incentive',
            'ministry': 'Ministry of New and Renewable Energy',
            'state': 'All-India',
            'category': 'energy',
            'beneficiary_types': ['industry', 'entrepreneur', 'cleantech'],
            'desc': 'Strategic Interventions for Green Hydrogen Transition (SIGHT) offering direct production incentives of ₹50/kg in Year 1 down to ₹30/kg in Year 3 and ₹4,440/kW for electrolyser manufacturing.',
            'benefit': 'Direct production incentive up to ₹50 per kg of green hydrogen produced',
            'quantum': '₹50 / kg Green Hydrogen Incentive',
            'type': 'direct_benefit',
            'days': 90,
            'rules': [
                {'field': 'citizen.occupation', 'op': 'IN', 'value': ['business', 'entrepreneur'], 'label': 'Cleantech Industrial Enterprise', 'impact': 'critical'}
            ],
            'flatRules': {'occupation': ['business', 'entrepreneur']},
            'docs': ['SECI Selection Letter', 'Audited Green Hydrogen Production Output Data', 'Udyam / CIN'],
            'url': 'https://mnre.gov.in',
            'completeness': 'INFORMATIONAL_ONLY'
        },
        {
            'id': 'energy-solar-city-248',
            'code': 'SOLAR-CITIES-DEVELOPMENT',
            'name': 'Development of Solar Cities Programme (100% Renewable Municipalities)',
            'short_name': 'Solar Cities Green Municipal Scheme',
            'ministry': 'Ministry of New and Renewable Energy',
            'state': 'All-India',
            'category': 'energy',
            'beneficiary_types': ['urban_resident', 'citizen'],
            'desc': 'Financial support up to ₹50 Lakh to designated municipal corporations to implement Master Plans for at least 10% reduction in conventional energy through solar installations.',
            'benefit': 'Subsidized community solar rooftop net metering and solar street lighting for all residents',
            'quantum': 'Community Solar Infrastructure & Net-Metering Access',
            'type': 'in_kind_and_services',
            'days': 30,
            'rules': [
                {'field': 'citizen.occupation', 'op': 'IN', 'value': ['employed', 'salaried', 'self_employed', 'business', 'homemaker'], 'label': 'Resident of Model Solar City (e.g. Sanchi, Ayodhya)', 'impact': 'moderate'}
            ],
            'flatRules': {'occupation': ['employed', 'salaried', 'self_employed', 'business', 'homemaker']},
            'docs': ['Municipal Property Tax Receipt', 'DISCOM Electricity Bill'],
            'url': 'https://mnre.gov.in',
            'completeness': 'INFORMATIONAL_ONLY'
        },
        {
            'id': 'energy-pat-energy-saving-249',
            'code': 'PAT-SCHEME',
            'name': 'Perform, Achieve and Trade (PAT) Scheme for Energy Conservation',
            'short_name': 'PAT Energy Saving Certificates',
            'ministry': 'Ministry of Power',
            'state': 'All-India',
            'category': 'energy',
            'beneficiary_types': ['industrialist', 'msme_owner'],
            'desc': 'Market-based mechanism certifying energy savings exceeding target thresholds as tradeable Energy Saving Certificates (ESCerts) traded on Power Exchanges (IEX/PXIL).',
            'benefit': 'Direct tradable revenue from ESCerts for exceeding certified energy savings targets',
            'quantum': 'Tradable ESCerts Worth ₹1,800+ each',
            'type': 'direct_benefit',
            'days': 60,
            'rules': [
                {'field': 'citizen.occupation', 'op': 'IN', 'value': ['business', 'entrepreneur'], 'label': 'Designated Industrial Energy Consumer', 'impact': 'moderate'}
            ],
            'flatRules': {'occupation': ['business', 'entrepreneur']},
            'docs': ['BEE Accredited Energy Audit Report', 'Form A Energy Consumption Data'],
            'url': 'https://beeindia.gov.in',
            'completeness': 'INFORMATIONAL_ONLY'
        },
        {
            'id': 'energy-revamped-discom-250',
            'code': 'RDSS-MODERNISATION',
            'name': 'Revamped Distribution Sector Scheme (RDSS Smart Prepaid Meters)',
            'short_name': 'RDSS Smart Prepaid Meter Scheme',
            'ministry': 'Ministry of Power',
            'state': 'All-India',
            'category': 'energy',
            'beneficiary_types': ['all_citizens', 'electricity_consumer'],
            'desc': 'Installation of 25 crore smart prepaid meters with ₹900 to ₹1,350 government incentive per consumer, enabling real-time mobile tracking of electricity usage and zero billing disputes.',
            'benefit': '100% free smart prepaid meter installation + mobile app tracking with daily consumption alerts',
            'quantum': 'Free Smart Prepaid Electric Meter',
            'type': 'in_kind_and_services',
            'days': 15,
            'rules': [
                {'field': 'citizen.occupation', 'op': 'IN', 'value': ['employed', 'salaried', 'farmer', 'self_employed', 'business', 'homemaker'], 'label': 'Electricity Consumer with Grid Connection', 'impact': 'moderate'}
            ],
            'flatRules': {'occupation': ['employed', 'salaried', 'farmer', 'self_employed', 'business', 'homemaker']},
            'docs': ['Electricity Consumer Connection Number', 'Aadhaar Card'],
            'url': 'https://powermin.gov.in',
            'completeness': 'INFORMATIONAL_ONLY'
        },
        {
            'id': 'energy-geothermal-re-251',
            'code': 'GEOTHERMAL-RENEWABLE',
            'name': 'Scheme for Deployment of Geothermal and Small Hydro Energy',
            'short_name': 'Small Hydro & Geothermal Grant',
            'ministry': 'Ministry of New and Renewable Energy',
            'state': 'Hilly and Himalayan States',
            'category': 'energy',
            'beneficiary_types': ['rural_community', 'entrepreneur'],
            'desc': 'Central Financial Assistance up to ₹7.5 Crore per MW for small hydro projects (up to 25 MW) and 50% capital grants for geothermal exploration and micro-grids in remote Himalayan regions.',
            'benefit': 'Capital grant up to ₹7.5 Crore/MW for localized clean decentralized power generation',
            'quantum': 'Up to ₹7.5 Crore / MW Capital Grant',
            'type': 'capital_subsidy',
            'days': 90,
            'rules': [
                {'field': 'citizen.occupation', 'op': 'IN', 'value': ['business', 'farmer', 'entrepreneur'], 'label': 'Renewable Energy Developer in Hilly State', 'impact': 'critical'}
            ],
            'flatRules': {'occupation': ['business', 'farmer', 'entrepreneur']},
            'docs': ['Water Flow & Head Survey Report', 'State Nodal Agency Approval', 'Bank Sanction Letter'],
            'url': 'https://mnre.gov.in',
            'completeness': 'INFORMATIONAL_ONLY'
        }
    ]
