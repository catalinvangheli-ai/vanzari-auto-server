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
    // Seria 1 (compacte)
    'Seria 1', '118i', '120i', '125i', '130i', 'M135i', 'M140i',
    'Seria 1 E81', 'Seria 1 E82', 'Seria 1 E87', 'Seria 1 E88',
    'Seria 1 F20', 'Seria 1 F21', 'Seria 1 F40',
    
    // Seria 2 (compacte și coupe)
    'Seria 2', 'Seria 2 Coupé', 'Seria 2 Gran Coupé',
    'Seria 2 Active Tourer', 'Seria 2 Gran Tourer',
    '218i', '220i', '225i', '228i', 'M235i', 'M240i',
    
    // Seria 3 (modelul emblematic)
    'Seria 3', '316i', '318i', '320i', '325i', '328i', '330i', '335i', '340i', 'M340i',
    'Seria 3 E21', 'Seria 3 E30', 'Seria 3 E36', 'Seria 3 E46',
    'Seria 3 E90', 'Seria 3 E91', 'Seria 3 E92', 'Seria 3 E93',
    'Seria 3 F30', 'Seria 3 F31', 'Seria 3 F34',
    'Seria 3 G20', 'Seria 3 G21',
    
    // Seria 4 (coupe, cabrio, gran coupe)
    'Seria 4', 'Seria 4 Coupé', 'Seria 4 Cabrio', 'Seria 4 Gran Coupé',
    '418i', '420i', '428i', '430i', '435i', '440i',
    'Seria 4 F32', 'Seria 4 F33', 'Seria 4 F36',
    'Seria 4 G22', 'Seria 4 G23', 'Seria 4 G26',
    
    // Seria 5 (business sedan)
    'Seria 5', '520i', '523i', '525i', '528i', '530i', '535i', '540i', '545i', '550i', 'M550i',
    'Seria 5 E12', 'Seria 5 E28', 'Seria 5 E34', 'Seria 5 E39',
    'Seria 5 E60', 'Seria 5 E61',
    'Seria 5 F10', 'Seria 5 F11',
    'Seria 5 G30', 'Seria 5 G31', 'Seria 5 G60',
    
    // Seria 6 (coupe & gran coupe)
    'Seria 6', 'Seria 6 Coupé', 'Seria 6 Gran Coupé', 'Seria 6 Cabrio',
    '630i', '640i', '645i', '650i',
    'Seria 6 E24', 'Seria 6 E63', 'Seria 6 E64',
    'Seria 6 F06', 'Seria 6 F12', 'Seria 6 F13',
    
    // Seria 7 (limuzină de lux)
    'Seria 7', '730i', '735i', '740i', '745i', '750i', '760i',
    'Seria 7 E23', 'Seria 7 E32', 'Seria 7 E38',
    'Seria 7 E65', 'Seria 7 E66',
    'Seria 7 F01', 'Seria 7 F02',
    'Seria 7 G11', 'Seria 7 G12', 'Seria 7 G70',
    
    // Seria 8 (super-lux & GT sportiv)
    'Seria 8', 'Seria 8 Coupé', 'Seria 8 Gran Coupé', 'Seria 8 Cabrio',
    '840i', '850i', 'M850i',
    'Seria 8 E31', 'Seria 8 G14', 'Seria 8 G15', 'Seria 8 G16',
    
    // Gama SUV - Seria X
    'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'XM',
    'X1 sDrive18i', 'X1 xDrive20i', 'X1 M35i',
    'X2 sDrive18i', 'X2 xDrive20i', 'X2 M35i',
    'X3 xDrive20i', 'X3 xDrive30i', 'X3 M40i',
    'X4 xDrive20i', 'X4 xDrive30i', 'X4 M40i',
    'X5 xDrive30i', 'X5 xDrive40i', 'X5 xDrive45e', 'X5 M50i',
    'X6 xDrive30i', 'X6 xDrive40i', 'X6 M50i',
    'X7 xDrive40i', 'X7 M50i', 'X7 M60i',
    
    // Modelele electrice BMW (Seria i)
    'i3', 'i4', 'i5', 'i7', 'i8',
    'iX', 'iX1', 'iX2', 'iX3',
    'i4 eDrive35', 'i4 eDrive40', 'i4 M50',
    'i5 eDrive40', 'i5 M60',
    'i7 xDrive60', 'i7 M70',
    
    // Modele BMW M (complete M)
    'M2', 'M3', 'M4', 'M5', 'M6', 'M8',
    'M2 Competition', 'M2 CS',
    'M3 Competition', 'M3 CS',
    'M4 Competition', 'M4 CSL',
    'M5 Competition', 'M5 CS',
    'M8 Competition', 'M8 Gran Coupé',
    'X3 M', 'X3 M Competition',
    'X4 M', 'X4 M Competition',
    'X5 M', 'X5 M Competition',
    'X6 M', 'X6 M Competition',
    'XM', 'XM Label Red',
    
    // Modele Roadster/Spider - Seria Z
    'Z1', 'Z3', 'Z4', 'Z8',
    'Z3 Roadster', 'Z3 Coupé',
    'Z4 Roadster', 'Z4 M40i', 'Z4 sDrive20i', 'Z4 sDrive30i'
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
    // Modele mici & compacte
    'Jazz', 'Fit', 'City', 'Civic', 'Insight',
    'Airwave', 'Brio', 'Logo',
    
    // Modele sedan & berline
    'Accord', 'Legend', 'Inspire', 'Grace',
    'Amaze', 'Crider', 'Spirior',
    'Clarity', 'Clarity Fuel Cell',
    
    // Modele SUV / Crossover
    'CR-V', 'HR-V', 'Vezel', 'ZR-V',
    'Pilot', 'Passport', 'Element',
    'Crossroad', 'Avancier', 'UR-V', 'WR-V',
    
    // Modele sport
    'NSX', 'S2000', 'CR-Z', 'Prelude',
    'Integra', 'Integra Type-R',
    'Beat', 'S660',
    'Civic Type-R', 'CR-X',
    
    // MPV / Monovolume
    'Odyssey', 'Odyssey EU', 'Odyssey USA',
    'StepWGN', 'StepWagon',
    'Freed', 'Elysion', 'Mobilio',
    'Stream', 'FR-V', 'Shuttle',
    
    // Pick-up & utilitare
    'Ridgeline', 'Acty Truck', 'Acty Van',
    'Hobio', 'Vamos', 'Street',
    
    // Modele electrice & hibride
    'e', 'e:NS1', 'e:NP1', 'e:Ny1',
    'Clarity Electric', 'Clarity Plug-in',
    'Insight Hybrid', 'Accord Hybrid',
    'CR-V Hybrid', 'Civic Hybrid'
  ],

  // FORD - toate modelele disponibile
  ford: [
    // Modele mici / Compacte
    'Ka', 'Ka+',
    'Fiesta', 'Fiesta ST',
    'Puma',
    'Focus', 'Focus ST', 'Focus RS',
    'Escort', 'Orion',
    
    // Modele medii
    'Mondeo',
    'Fusion', 'B-Max', 'C-Max', 'S-Max', 'Galaxy',
    
    // Crossover & SUV
    'EcoSport', 'Kuga', 'Edge', 'Explorer', 'Everest',
    'Bronco', 'Bronco Sport',
    
    // Modele Premium / Sport
    'Mustang', 'Mustang GT', 'Mustang Shelby',
    'GT', 'Probe', 'Capri', 'Cougar',
    
    // Modele Pick-up
    'Ranger', 'Ranger Raptor',
    'F-150', 'F-250', 'F-350', 'F-350 Super Duty',
    'Maverick',
    
    // Modele Vans / Utilitare
    'Transit', 'Transit Custom', 'Transit Connect', 'Transit Courier',
    'Tourneo Custom', 'Tourneo Connect', 'Tourneo Courier',
    'Econoline', 'E-Series',
    
    // Modele Electrice / Hybrid
    'Mustang Mach-E',
    'Explorer Electric',
    'E-Transit', 'E-Transit Custom',
    
    // Modele vechi/retro
    'Taunus', 'Sierra', 'Granada', 'Scorpio',
    'Cortina', 'Zephyr'
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
    // Modele actuale (2020+)
    'Giulia', 'Stelvio', 'Tonale', 'Junior',
    
    // Modele recente - Compacte / hatchback (2000-2020)
    '147', 'MiTo', 'Giulietta',
    
    // Modele recente - Sedan / berline
    '156', '159', '166',
    
    // Modele recente - Coupé / sportive
    'GT', 'Brera', 'Spider', '4C', 
    '8C Competizione', '8C Spider',
    
    // Modele din anii '80-'90
    '33', '75', '90', '145', '146', '164', 
    'SZ', 'RZ'
  ],

  // FIAT - toate modelele disponibile
  fiat: [
    // Modele mici / City car
    '500', '500 Hybrid', '500 Electric', '500C', '500e',
    'Panda', 'Panda Hybrid', 'Panda Cross',
    
    // Supermini / Compacte
    '500L', '500X',
    'Tipo', 'Tipo Hatchback', 'Tipo Sedan', 'Tipo Station Wagon', 'Tipo Cross',
    
    // Modele utilitare pentru pasageri
    'Doblo', 'Doblo Combi',
    'Fiorino Combi',
    'Scudo', 'Scudo Combi',
    'Ulysse',
    
    // Modele utilitare N1 (dube)
    'Fiorino Cargo', 'Doblo Cargo',
    'Talento', 'Ducato',
    
    // Electrice
    'E-Doblo', 'E-Scudo', 'E-Ducato',
    
    // Modele iconice / clasice
    '500 original', '600', '850',
    '124', '125', '126', '127', '128', '131', '132',
    'Topolino',
    'Uno', 'Cinquecento', 'Seicento',
    'Punto', 'Punto Evo', 'Grande Punto',
    'Palio', 'Siena', 'Tempra',
    'Tipo original', 'Croma', 'Regata', 'Ritmo',
    'Stilo', 'Bravo', 'Brava', 'Linea',
    'Marea', 'Marea Weekend',
    'Coupe', 'Barchetta', 'X1/9',
    'Qubo', 'Freemont',
    
    // Sport / Roadster
    '124 Spider', '124 Spider Classic',
    'Coupe Turbo',
    
    // Abarth (derivate sportive)
    '500 Abarth', 'Punto Abarth',
    'Abarth 595', 'Abarth 695', 'Abarth 750', 'Abarth 1000'
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

  // CITROËN - franceză (toate modelele)
  citroen: [
    // Modele de oraș (mici)
    'C1', 'C2', 'C3', 'C3 Pluriel', 'C3 Picasso', 'C3 Aircross',
    
    // Modele compacte
    'C4', 'C4 Cactus', 'C4 X', 'C4 Aircross',
    
    // Modele sedan / crossover
    'C5', 'C5 X', 'C5 Aircross',
    
    // Modele monovolum / familiale
    'Xsara Picasso', 'C4 Picasso', 'C4 Grand Picasso', 
    'C4 SpaceTourer', 'Grand C4 SpaceTourer', 
    'C8', 'Evasion', 'Synergie',
    
    // Modele sedan / premium
    'C6', 'C4 Sedan', 'C-Elysée',
    
    // Modele utilitare și derivate
    'Berlingo', 'Berlingo Multispace', 'Berlingo Combi',
    'Jumpy', 'Dispatch', 'Jumper', 'Nemo',
    
    // Modele electrice (EV)
    'ë-C4', 'ë-C3', 'ë-C4 X', 'Ami',
    'ë-Berlingo', 'ë-Jumpy', 'ë-Jumper',
    
    // Modele clasice / vintage
    '2CV', 'DS', 'SM', 'GS', 'GSA', 'CX', 'BX', 'XM',
    'AX', 'Saxo', 'Visa', 'ZX'
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