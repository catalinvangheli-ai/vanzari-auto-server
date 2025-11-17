// src/utils/vehicleData.js
// Date complete pentru toate mărcile și modelele de vehicule

export const marci = {
  Autoturism: [
    // Mărci premium germane
    { value: 'audi', label: 'Audi' },
    { value: 'bmw', label: 'BMW' },
    { value: 'mercedes', label: 'Mercedes-Benz' },
    { value: 'smart', label: 'Smart' },
    
    // Mărci germane mainstream
    { value: 'volkswagen', label: 'Volkswagen' },
    { value: 'opel', label: 'Opel' },
    
    // Mărci japoneze
    { value: 'toyota', label: 'Toyota' },
    { value: 'honda', label: 'Honda' },
    { value: 'nissan', label: 'Nissan' },
    { value: 'mazda', label: 'Mazda' },
    { value: 'lexus', label: 'Lexus' },
    { value: 'infiniti', label: 'Infiniti' },
    
    // Mărci americane
    { value: 'ford', label: 'Ford' },
    { value: 'jeep', label: 'Jeep' },
    
    // Mărci franceze
    { value: 'renault', label: 'Renault' },
    { value: 'peugeot', label: 'Peugeot' },
    
    // Mărci coreene
    { value: 'hyundai', label: 'Hyundai' },
    { value: 'kia', label: 'Kia' },
    
    // Mărci din grupul VW
    { value: 'skoda', label: 'Škoda' },
    { value: 'seat', label: 'SEAT' },
    
    // Mărci italiene
    { value: 'fiat', label: 'Fiat' },
    { value: 'alfa romeo', label: 'Alfa Romeo' },
    
    // Mărci nordice
    { value: 'volvo', label: 'Volvo' },
    
    // Mărci britanice
    { value: 'mini', label: 'MINI' },
    
    // Mărci românești și budget
    { value: 'dacia', label: 'Dacia' },
    
    // Mărci premium și luxury
    { value: 'bentley', label: 'Bentley' },
    { value: 'ferrari', label: 'Ferrari' },
    { value: 'lamborghini', label: 'Lamborghini' },
    { value: 'maserati', label: 'Maserati' },
    { value: 'mclaren', label: 'McLaren' },
    { value: 'porsche', label: 'Porsche' },
    { value: 'rolls royce', label: 'Rolls-Royce' },
    { value: 'jaguar', label: 'Jaguar' },
    { value: 'land rover', label: 'Land Rover' },
    
    // Mărci americane adiționale
    { value: 'cadillac', label: 'Cadillac' },
    { value: 'chevrolet', label: 'Chevrolet' },
    { value: 'chrysler', label: 'Chrysler' },
    { value: 'dodge', label: 'Dodge' },
    
    // Mărci franceze adiționale
    { value: 'citroen', label: 'Citroën' },
    { value: 'ds automobiles', label: 'DS Automobiles' },
    
    // Mărci spaniole
    { value: 'cupra', label: 'Cupra' },
    
    // Mărci italiene adiționale
    { value: 'lancia', label: 'Lancia' },
    
    // Mărci japoneze adiționale
    { value: 'mitsubishi', label: 'Mitsubishi' },
    { value: 'subaru', label: 'Subaru' },
    { value: 'suzuki', label: 'Suzuki' },
    
    // Mărci coreene adiționale
    { value: 'ssangyong', label: 'SsangYong' },
    { value: 'daewoo', label: 'Daewoo' },
    
    // Mărci japoneze vintage
    { value: 'daihatsu', label: 'Daihatsu' },
    
    // Mărci britanice adiționale
    { value: 'rover', label: 'Rover' },
    { value: 'mg', label: 'MG' },
    
    // Mărci svedeze adiționale
    { value: 'saab', label: 'Saab' },
    
    // Mărci franceze microcars
    { value: 'aixam', label: 'Aixam' },
    
    // Mărci electrice
    { value: 'tesla', label: 'Tesla' },
    
    // Alte mărci (chinezești și mai puțin cunoscute)
    { value: 'alte marci', label: 'Alte mărci' }
  ],
  
  'Motocicletă': [
    { value: 'yamaha', label: 'Yamaha' },
    { value: 'honda', label: 'Honda' },
    { value: 'kawasaki', label: 'Kawasaki' },
    { value: 'suzuki', label: 'Suzuki' },
    { value: 'ducati', label: 'Ducati' },
    { value: 'bmw', label: 'BMW Motorrad' },
    { value: 'ktm', label: 'KTM' },
    { value: 'aprilia', label: 'Aprilia' },
    { value: 'triumph', label: 'Triumph' },
    { value: 'harley-davidson', label: 'Harley-Davidson' }
  ],
  
  'Autoutilitară': [
    { value: 'ford', label: 'Ford' },
    { value: 'mercedes', label: 'Mercedes-Benz' },
    { value: 'volkswagen', label: 'Volkswagen' },
    { value: 'iveco', label: 'Iveco' },
    { value: 'man', label: 'MAN' },
    { value: 'scania', label: 'Scania' },
    { value: 'volvo', label: 'Volvo Trucks' },
    { value: 'daf', label: 'DAF' },
    { value: 'renault', label: 'Renault Trucks' },
    { value: 'isuzu', label: 'Isuzu' }
  ],
  
  'Rulotă': [
    { value: 'hobby', label: 'Hobby' },
    { value: 'knaus', label: 'Knaus' },
    { value: 'dethleffs', label: 'Dethleffs' },
    { value: 'fendt', label: 'Fendt' },
    { value: 'adria', label: 'Adria' },
    { value: 'hymer', label: 'Hymer' },
    { value: 'burstner', label: 'Bürstner' },
    { value: 'weinsberg', label: 'Weinsberg' }
  ],
  
  Scuter: [
    { value: 'yamaha', label: 'Yamaha' },
    { value: 'honda', label: 'Honda' },
    { value: 'piaggio', label: 'Piaggio' },
    { value: 'sym', label: 'SYM' },
    { value: 'kymco', label: 'KYMCO' },
    { value: 'aprilia', label: 'Aprilia' },
    { value: 'peugeot', label: 'Peugeot Scooters' }
  ]
};

export const modele = {
  // AUDI - toate modelele disponibile
  audi: [
    'A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8',
    'Q2', 'Q3', 'Q4', 'Q5', 'Q7', 'Q8',
    'TT', 'R8', 'e-tron GT',
    'S3', 'S4', 'S5', 'S6', 'S7', 'S8',
    'RS3', 'RS4', 'RS5', 'RS6', 'RS7', 'RS Q3', 'RS Q8'
  ],

  // BMW - toate modelele disponibile  
  bmw: [
    'Seria 1', 'Seria 2', 'Seria 3', 'Seria 4', 'Seria 5', 'Seria 6', 'Seria 7', 'Seria 8',
    'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7',
    'Z4', 'i3', 'i4', 'iX', 'iX3',
    'M2', 'M3', 'M4', 'M5', 'M8',
    'X3 M', 'X4 M', 'X5 M', 'X6 M'
  ],

  // MERCEDES-BENZ - toate modelele disponibile
  mercedes: [
    'Clasa A', 'Clasa B', 'Clasa C', 'Clasa E', 'Clasa S',
    'CLA', 'CLS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS',
    'G-Class', 'SL', 'SLC', 'AMG GT',
    'EQA', 'EQB', 'EQC', 'EQE', 'EQS',
    'A 35 AMG', 'A 45 AMG', 'C 43 AMG', 'C 63 AMG',
    'E 53 AMG', 'E 63 AMG', 'S 63 AMG', 'GLC 43 AMG', 'GLE 53 AMG'
  ],

  // SMART - toate modelele disponibile
  smart: [
    'Fortwo', 'Forfour', 'EQ Fortwo', 'EQ Forfour',
    'Fortwo Coupe', 'Fortwo Cabrio', 
    'Forfour Passion', 'Forfour Prime',
    'Fortwo Electric Drive', 'Forfour Electric Drive',
    'Roadster', 'Crossblade'
  ],

  // VOLKSWAGEN - toate modelele disponibile
  volkswagen: [
    'Polo', 'Golf', 'Jetta', 'Passat', 'Arteon', 'Phaeton',
    'T-Cross', 'T-Roc', 'Tiguan', 'Touareg', 'Atlas',
    'Up!', 'ID.3', 'ID.4', 'ID.5', 'ID.6', 'ID.7', 'ID.Buzz',
    'Golf R', 'Tiguan R', 'Touareg R',
    'Beetle', 'Scirocco', 'Eos', 'CC', 'Sharan', 'Touran',
    'Caddy', 'Multivan', 'Crafter', 'Amarok'
  ],

  // TOYOTA - toate modelele disponibile
  toyota: [
    'Yaris', 'Corolla', 'Camry', 'Avalon',
    'C-HR', 'RAV4', 'Highlander', 'Land Cruiser',
    'Prius', 'Prius+', 'Mirai',
    'Supra', 'GR Yaris', 'GR86',
    'Proace', 'Hilux'
  ],

  // HONDA - toate modelele disponibile  
  honda: [
    'Jazz', 'Civic', 'Accord', 'Insight',
    'HR-V', 'CR-V', 'Pilot',
    'e:Ny1', 'ZR-V',
    'Civic Type R', 'NSX'
  ],

  // FORD - toate modelele disponibile
  ford: [
    'Ka+', 'Fiesta', 'Focus', 'Mondeo', 'Mustang',
    'EcoSport', 'Puma', 'Kuga', 'Explorer', 'Edge',
    'Tourneo Connect', 'Tourneo Custom', 'Transit Connect', 'Transit Custom', 'Transit',
    'Ranger', 'F-150',
    'Focus ST', 'Focus RS', 'Fiesta ST', 'Mustang GT'
  ],

  // OPEL - toate modelele disponibile
  opel: [
    'Corsa', 'Astra', 'Insignia', 'Crossland', 'Mokka', 'Grandland',
    'Combo Life', 'Zafira Life',
    'Corsa-e', 'Mokka-e', 'Grandland X Hybrid',
    'Adam', 'Karl'
  ],

  // RENAULT - toate modelele disponibile
  renault: [
    'Twingo', 'Clio', 'Megane', 'Talisman',
    'Captur', 'Kadjar', 'Koleos', 'Austral',
    'Scenic', 'Espace', 'Grand Scenic',
    'ZOE', 'Megane E-Tech', 'Arkana',
    'Clio RS', 'Megane RS'
  ],

  // PEUGEOT - toate modelele disponibile  
  peugeot: [
    '108', '208', '308', '508',
    '2008', '3008', '5008',
    'Partner Tepee', 'Rifter', 'Traveller',
    'e-208', 'e-2008', 'e-308',
    '208 GTi', '308 GTi', '508 PSE'
  ],

  // DACIA - modelele disponibile
  dacia: [
    'Sandero', 'Logan', 'Duster', 'Lodgy', 'Dokker',
    'Spring', 'Jogger', 'Sandero Stepway',
    'Logan MCV', 'Duster ECO-G', 'Bigster'
  ],

  // SKODA - toate modelele disponibile
  skoda: [
    'Citigo', 'Fabia', 'Scala', 'Octavia', 'Superb',
    'Kamiq', 'Karoq', 'Kodiaq',
    'Enyaq iV',
    'Octavia RS', 'Kodiaq RS'
  ],

  // SEAT - toate modelele disponibile
  seat: [
    'Mii', 'Ibiza', 'Leon', 'Toledo',
    'Arona', 'Ateca', 'Tarraco',
    'Leon Cupra', 'Ateca Cupra'
  ],

  // HYUNDAI - toate modelele disponibile
  hyundai: [
    'i10', 'i20', 'i30', 'Elantra', 'Sonata',
    'Bayon', 'Kona', 'Tucson', 'Santa Fe', 'Nexo',
    'IONIQ 5', 'IONIQ 6',
    'i30 N', 'Kona N'
  ],

  // KIA - toate modelele disponibile
  kia: [
    'Picanto', 'Rio', 'Ceed', 'Cerato', 'Stinger',
    'Stonic', 'XCeed', 'Sportage', 'Sorento',
    'EV6', 'Niro',
    'Ceed GT', 'Stinger GT'
  ],

  // NISSAN - toate modelele disponibile
  nissan: [
    'Micra', 'Note', 'Sentra', 'Altima',
    'Juke', 'Qashqai', 'X-Trail', 'Murano', 'Pathfinder',
    'Leaf', 'Ariya',
    '370Z', 'GT-R'
  ],

  // MAZDA - toate modelele disponibile
  mazda: [
    'Mazda2', 'Mazda3', 'Mazda6',
    'CX-3', 'CX-30', 'CX-5', 'CX-60', 'CX-9',
    'MX-5', 'RX-8'
  ],

  // VOLVO - toate modelele disponibile  
  volvo: [
    'V40', 'V60', 'V90', 'S60', 'S90',
    'XC40', 'XC60', 'XC90',
    'C40 Recharge', 'XC40 Recharge',
    'Polestar 1', 'Polestar 2'
  ],

  // LEXUS - toate modelele disponibile
  lexus: [
    'CT', 'IS', 'ES', 'GS', 'LS',
    'UX', 'NX', 'RX', 'GX', 'LX',
    'LC', 'RC'
  ],

  // INFINITI - toate modelele disponibile
  infiniti: [
    'Q30', 'Q50', 'Q60', 'Q70',
    'QX30', 'QX50', 'QX60', 'QX70', 'QX80'
  ],

  // ALFA ROMEO - toate modelele disponibile
  'alfa romeo': [
    'MiTo', 'Giulietta', 'Giulia', 'Stelvio',
    '4C', '8C', 'Tonale'
  ],

  // FIAT - toate modelele disponibile
  fiat: [
    '500', '500X', '500L', 'Panda', 'Punto', 'Tipo',
    'Doblo', 'Qubo', 'Freemont',
    '500 Abarth', 'Punto Abarth'
  ],

  // JEEP - toate modelele disponibile
  jeep: [
    'Renegade', 'Compass', 'Cherokee', 'Grand Cherokee',
    'Wrangler', 'Gladiator', 'Avenger'
  ],

  // MINI - toate modelele disponibile
  mini: [
    'Cooper', 'Cooper S', 'Cooper SE',
    'Clubman', 'Countryman', 'Paceman',
    'John Cooper Works'
  ],

  // MOTOCICLETE - YAMAHA
  yamaha: [
    // Sport
    'YZF-R1', 'YZF-R6', 'YZF-R3', 'YZF-R125',
    // Naked
    'MT-09', 'MT-07', 'MT-03', 'MT-125', 'MT-10',
    // Touring
    'Tracer 9', 'Tracer 7', 'FJR1300',
    // Cross/Enduro  
    'Tenere 700', 'WR250R', 'YZ450F', 'YZ250F',
    // Scuter
    'XMAX 300', 'NMAX 155', 'Aerox 155'
  ],

  // KAWASAKI MOTOCICLETE
  kawasaki: [
    // Sport
    'Ninja ZX-10R', 'Ninja ZX-6R', 'Ninja 650', 'Ninja 400', 'Ninja 300',
    // Naked
    'Z1000', 'Z900', 'Z650', 'Z400', 'Z300',
    // Touring
    'Versys 1000', 'Versys 650', 'Versys-X 300',
    // Cross/Enduro
    'KLX450R', 'KLX300R', 'KX450F', 'KX250F'
  ],

  // SUZUKI MOTOCICLETE  
  suzuki: [
    // Sport
    'GSX-R1000', 'GSX-R750', 'GSX-R600', 'GSX-R125',
    // Naked
    'GSX-S1000', 'GSX-S750', 'GSX-S125',
    // Touring
    'V-Strom 1050', 'V-Strom 650', 'V-Strom 250',
    // Cross/Enduro
    'RMZ450', 'RMZ250', 'DR-Z400SM'
  ],

  // DUCATI MOTOCICLETE
  ducati: [
    // Sport
    'Panigale V4', 'Panigale V2', '959 Panigale',
    // Naked
    'Monster 1200', 'Monster 821', 'Monster 797',
    // Adventure
    'Multistrada V4', 'Multistrada 950', 'Desert X',
    // Heritage
    'Scrambler Icon', 'Scrambler Desert Sled', 'Diavel'
  ],

  // KTM MOTOCICLETE
  ktm: [
    '390 Duke', '790 Duke', '1290 Super Duke',
    '390 Adventure', '790 Adventure', '1290 Super Adventure',
    'RC 390', 'RC 200', '1290 Super Duke R'
  ],

  // APRILIA MOTOCICLETE
  aprilia: [
    'RS 660', 'Tuono 660', 'RSV4 1100',
    'Shiver 900', 'Dorsoduro 900',
    'SR 150', 'SR 50'
  ],

  // TRIUMPH MOTOCICLETE  
  triumph: [
    'Street Twin', 'Bonneville T120', 'Thruxton RS',
    'Speed Triple', 'Street Triple', 'Tiger 900',
    'Rocket 3', 'Daytona 765'
  ],

  // HARLEY-DAVIDSON MOTOCICLETE
  'harley-davidson': [
    'Iron 883', 'Forty-Eight', 'Street Glide',
    'Road King', 'Fat Boy', 'Breakout',
    'Pan America', 'LiveWire'
  ],

  // VEHICULE UTILITARE - IVECO
  iveco: [
    'Daily Van', 'Daily Chassis Cab', 'Daily Combi',
    'Eurocargo', 'Trakker', 'Stralis', 'S-Way'
  ],

  // MAN CAMIOANE
  man: [
    'TGL', 'TGM', 'TGS', 'TGX'
  ],

  // SCANIA CAMIOANE  
  scania: [
    'P-Series', 'G-Series', 'R-Series', 'S-Series'
  ],

  // VOLVO TRUCKS
  'volvo trucks': [
    'FH', 'FM', 'FMX', 'FE', 'FL'
  ],

  // DAF CAMIOANE
  daf: [
    'XF', 'CF', 'LF'
  ],

  // RENAULT TRUCKS
  'renault trucks': [
    'T', 'C', 'K', 'D'
  ],

  // ISUZU CAMIOANE
  isuzu: [
    'N-Series', 'F-Series', 'C&E Series'
  ],

  // RULOTE - HOBBY
  hobby: [
    'De Luxe', 'Prestige', 'Excellent', 'Optima',
    'Beachy', 'Vantana', 'Ontour'
  ],

  // KNAUS RULOTE
  knaus: [
    'Sport', 'Südwind', 'Sky Wave', 'Deseo',
    'Live Wave', 'Travelino'
  ],

  // DETHLEFFS RULOTE
  dethleffs: [
    'Camper', 'Advantage', 'Generation', 'Nomad',
    'c-go', 'Beduin'
  ],

  // FENDT RULOTE
  fendt: [
    'Bianco', 'Caravan', 'Diamant', 'Saphir',
    'Opal', 'Tendenza'
  ],

  // RULOTE NOI - ADRIA
  adria: [
    'Alpina', 'Astella', 'Aviva', 'Action'
  ],

  // HYMER RULOTE
  hymer: [
    'Nova', 'Touring', 'Eriba', 'Adventurer'
  ],

  // BÜRSTNER RULOTE
  burstner: [
    'Premio', 'Averso', 'Lyseo', 'Campeo'
  ],

  // WEINSBERG RULOTE  
  weinsberg: [
    'CaraOne', 'CaraCore', 'CaraBus', 'CaraCompact'
  ],

  // SCUTERE - PIAGGIO
  piaggio: [
    'Vespa Primavera', 'Vespa Sprint', 'Vespa GTS',
    'Liberty', 'Beverly', 'MP3',
    'Medley', 'Fly'
  ],

  // SYM SCUTERE
  sym: [
    'Jet 14', 'Orbit III', 'Fiddle III',
    'Maxsym TL', 'Cruisym', 'Joymax Z'
  ],

  // KYMCO SCUTERE
  kymco: [
    'Agility City', 'Like', 'People S',
    'AK 550', 'Xciting S', 'Super 8'
  ],

  // PEUGEOT SCOOTERS
  'peugeot scooters': [
    'Django', 'Speedfight', 'Kisbee',
    'Metropolis', 'Belville'
  ],

  // AIXAM - microcar francez
  aixam: [
    'City', 'Crossline', 'Coupe', 'GTO',
    'e-City', 'e-Crossline'
  ],

  // BENTLEY - luxury britanică
  bentley: [
    'Continental GT', 'Continental GTC', 'Flying Spur',
    'Bentayga', 'Mulsanne', 'Bacalar', 'Mulliner'
  ],

  // CADILLAC - luxury americană
  cadillac: [
    'CT4', 'CT5', 'CT6',
    'XT4', 'XT5', 'XT6',
    'Escalade', 'Lyriq'
  ],

  // CHEVROLET - americană mainstream
  chevrolet: [
    'Spark', 'Aveo', 'Cruze', 'Malibu', 'Impala',
    'Camaro', 'Corvette',
    'Trax', 'Equinox', 'Traverse', 'Tahoe', 'Suburban',
    'Silverado', 'Colorado'
  ],

  // CHRYSLER - americană
  chrysler: [
    '300', 'Pacifica', 'Voyager',
    'Sebring', 'PT Cruiser'
  ],

  // CITROËN - franceză
  citroen: [
    'C1', 'C3', 'C3 Aircross', 'C4', 'C5 Aircross',
    'Berlingo', 'SpaceTourer',
    'ë-C4', 'Ami',
    'C3 Pluriel', 'C4 Cactus', 'C4 Picasso', 'Grand C4 Picasso'
  ],

  // CUPRA - sportivă spaniolă (sub-brand SEAT)
  cupra: [
    'Born', 'Formentor', 'Leon', 'Ateca',
    'Tavascan'
  ],

  // DAEWOO - coreeană (brand vintage)
  daewoo: [
    'Matiz', 'Kalos', 'Lanos', 'Nubira', 'Leganza',
    'Tacuma', 'Rezzo'
  ],

  // DAIHATSU - japoneză (brand vintage)
  daihatsu: [
    'Cuore', 'Sirion', 'Terios', 'Materia',
    'Copen', 'Move', 'YRV'
  ],

  // DODGE - americană sport
  dodge: [
    'Charger', 'Challenger', 'Durango',
    'Ram 1500', 'Ram 2500',
    'Viper', 'Journey', 'Caliber'
  ],

  // DS AUTOMOBILES - premium franceză
  'ds automobiles': [
    'DS 3', 'DS 3 Crossback', 'DS 4', 'DS 7 Crossback', 'DS 9',
    'DS 3 E-Tense'
  ],

  // FERRARI - supercar italiană
  ferrari: [
    '488 GTB', '488 Pista', 'F8 Tributo',
    '812 Superfast', '812 GTS',
    'SF90 Stradale', 'SF90 Spider',
    'Roma', 'Portofino', 'Portofino M',
    '296 GTB', '296 GTS',
    'Purosangue',
    'LaFerrari', 'Enzo', 'F40', 'F50'
  ],

  // JAGUAR - premium britanică
  jaguar: [
    'XE', 'XF', 'XJ',
    'E-Pace', 'F-Pace', 'I-Pace',
    'F-Type',
    'XK', 'XKR', 'S-Type'
  ],

  // LAMBORGHINI - supercar italiană
  lamborghini: [
    'Huracán', 'Huracán EVO', 'Huracán Tecnica',
    'Aventador', 'Aventador SVJ', 'Aventador Ultimae',
    'Urus', 'Urus Performante',
    'Revuelto',
    'Gallardo', 'Murciélago', 'Countach'
  ],

  // LANCIA - italiană
  lancia: [
    'Ypsilon', 'Delta', 'Thema',
    'Musa', 'Phedra', 'Voyager'
  ],

  // LAND ROVER - SUV premium britanică
  'land rover': [
    'Defender', 'Defender 90', 'Defender 110', 'Defender 130',
    'Discovery', 'Discovery Sport',
    'Range Rover', 'Range Rover Sport', 'Range Rover Velar', 'Range Rover Evoque',
    'Freelander'
  ],

  // MASERATI - luxury sportivă italiană
  maserati: [
    'Ghibli', 'Quattroporte', 'Levante',
    'MC20', 'GranTurismo', 'GranCabrio',
    'Grecale'
  ],

  // MCLAREN - supercar britanică
  mclaren: [
    '540C', '570S', '570GT', '600LT',
    '720S', '720S Spider', '765LT',
    'GT', 'Artura',
    'P1', 'Senna', 'Speedtail', 'Elva'
  ],

  // MITSUBISHI - japoneză
  mitsubishi: [
    'Space Star', 'Mirage',
    'ASX', 'Eclipse Cross', 'Outlander', 'Pajero',
    'L200', 'Lancer', 'Lancer Evolution',
    'i-MiEV'
  ],

  // MG - britanică (deținută de chinezi)
  mg: [
    'MG3', 'MG4 Electric', 'MG5 Electric',
    'MG HS', 'MG ZS', 'MG Marvel R',
    'MG TF', 'MG ZR', 'MG ZT'
  ],

  // PORSCHE - premium sportivă germană
  porsche: [
    '911', '911 Carrera', '911 Turbo', '911 GT3', '911 GT2 RS',
    '718 Boxster', '718 Cayman',
    'Cayenne', 'Cayenne Coupe',
    'Macan',
    'Panamera',
    'Taycan', 'Taycan Cross Turismo',
    'Carrera GT', '918 Spyder'
  ],

  // ROLLS-ROYCE - ultra-luxury britanică
  'rolls royce': [
    'Phantom', 'Ghost', 'Wraith', 'Dawn',
    'Cullinan', 'Spectre'
  ],

  // ROVER - britanică (brand vintage)
  rover: [
    '25', '45', '75', '200', '400', '600', '800',
    'Streetwise', 'CityRover'
  ],

  // SAAB - suedeză (brand vintage)
  saab: [
    '9-3', '9-5', '900', '9000',
    '9-3 Convertible', '9-3 SportCombi'
  ],

  // SSANGYONG - coreeană SUV
  ssangyong: [
    'Tivoli', 'Korando', 'Rexton', 'Musso',
    'XLV', 'Rodius'
  ],

  // SUBARU - japoneză AWD
  subaru: [
    'Impreza', 'Legacy', 'Outback',
    'Forester', 'XV', 'Ascent',
    'WRX', 'WRX STI', 'BRZ',
    'Levorg', 'Solterra'
  ],

  // SUZUKI - pentru autoturisme
  'suzuki': [
    'Alto', 'Celerio', 'Swift', 'Baleno', 'Ignis',
    'Vitara', 'S-Cross', 'Jimny',
    'SX4', 'Splash', 'Kizashi'
  ],

  // TESLA - vehicule electrice
  tesla: [
    'Model S', 'Model 3', 'Model X', 'Model Y',
    'Cybertruck', 'Roadster'
  ],

  // ALTE MARCI - chinezești și mai puțin cunoscute
  'alte marci': [
    'BYD', 'Geely', 'Great Wall', 'Haval', 'Chery', 'JAC',
    'Lynk & Co', 'Nio', 'Xpeng', 'Li Auto', 'Hongqi',
    'Aiways', 'Ora', 'Maxus', 'Forthing', 'Polestar',
    'Genesis', 'Maybach', 'Acura', 'Scion', 'Saturn',
    'Hummer', 'Pontiac', 'Buick', 'GMC', 'Ram',
    'Isuzu', 'Proton', 'Tata', 'Mahindra'
  ]
};

export default { marci, modele };