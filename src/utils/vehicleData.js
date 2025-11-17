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
    // Compacte / Hatchback / Sedan
    'A-Class', 'A-Class W177', 'A-Class Sedan',
    'B-Class',
    'CLA-Class', 'CLA C118', 'CLA Shooting Brake',
    'C-Class', 'C-Class W206', 'C-Class Estate', 'C-Class AMG',
    'E-Class', 'E-Class W213', 'E-Class W214', 'E-Class Estate', 'E-Class All-Terrain',
    'S-Class', 'S-Class W223', 'S-Class Maybach',
    'CLS',
    
    // SUV / Crossover / Off-road
    'GLA-Class', 'GLB-Class', 'GLC-Class', 'GLC Coupe',
    'GLE-Class', 'GLE Coupe', 'GLS-Class',
    'G-Class',
    
    // Sport / Performanță
    'AMG GT', 'AMG GT 4-Door',
    'C-Class AMG', 'E-Class AMG', 'GLC AMG', 'GLE AMG', 'S-Class AMG',
    'A 35 AMG', 'A 45 AMG', 'C 43 AMG', 'C 63 AMG',
    'E 53 AMG', 'E 63 AMG', 'S 63 AMG', 'GLC 43 AMG', 'GLE 53 AMG',
    
    // Electrice (EQ Series)
    'EQA', 'EQB', 'EQC', 'EQE', 'EQE SUV', 'EQS', 'EQS SUV', 'EQG',
    'EQA 250e', 'EQB 350e', 'EQC 400 4MATIC',
    
    // Monovolume / MPV / Van
    'V-Class', 'Vito', 'Sprinter',
    
    // Pickup / Utilitare
    'X-Class', 'Vito Van', 'Sprinter Van',
    
    // Hibride și plug-in hybrid (PHEV)
    'A-Class PHEV', 'B-Class PHEV', 'C-Class PHEV', 'E-Class PHEV', 'S-Class PHEV',
    'GLA PHEV', 'GLB PHEV', 'GLC PHEV', 'GLE PHEV', 'GLS PHEV',
    
    // Modele retrase / clasice notabile
    '190', 'W201', '300D', '124', '123', '600', 'W100', 'W140',
    '300SL', 'Gullwing', '500E', 'E500',
    'CLK-Class', 'SL-Class', 'SL R107', 'SL R129', 'SL R230', 'SL R231',
    'SLC', 'SLK', 'R-Class'
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
    // Compacte / Hatchback / Sedan
    'Up!', 'e-Up!',
    'Polo', 'Polo GTI', 'Polo Classic',
    'Virtus',
    'Golf', 'Golf GTI', 'Golf R', 'Golf Sportsvan', 'e-Golf',
    'Jetta', 'Vento',
    'Passat', 'Passat Variant', 'Passat GTE',
    'Arteon', 'Arteon eHybrid',
    
    // SUV / Crossover
    'T-Cross', 'T-Roc', 'Taigo',
    'Tiguan', 'Tiguan Allspace', 'Tiguan eHybrid', 'Tiguan R',
    'Touareg', 'Touareg R',
    'Atlas',
    
    // Pickup / Utilitare
    'Amarok',
    'Caddy',
    'Transporter', 'T6', 'T7',
    'Multivan',
    'Crafter',
    
    // Electrice & Hibride
    'ID.3', 'ID.4', 'ID.4 GTX', 'ID.5', 'ID.6', 'ID.7',
    'ID. Buzz', 'ID. Buzz Cargo',
    
    // Modele retrase / clasice notabile
    'Beetle', 'Käfer', 'Beetle Cabrio',
    'Karmann Ghia',
    'Type 2', 'Transporter T1', 'Transporter T2', 'Transporter T3', 'Transporter T4', 'Transporter T5',
    'Scirocco', 'Corrado',
    'Phaeton', 'Eos', 'CC', 'Sharan', 'Touran'
  ],

  // TOYOTA - toate modelele disponibile
  toyota: [
    // Compacte / Hatchback / Sedan
    'Aygo', 'Yaris', 'Yaris Cross',
    'Corolla Hatchback', 'Corolla Sedan', 'Corolla Cross', 'Corolla Touring Sports', 'Corolla Wagon',
    'Camry',
    'Prius', 'Prius Plug-in',
    'Mirai',
    
    // SUV / Crossover / Off-road
    'C-HR',
    'RAV4', 'RAV4 Prime',
    'Harrier', 'Venza', 'Highlander',
    'Fortuner', '4Runner',
    'Land Cruiser', 'Land Cruiser Prado',
    'Sequoia', 'FJ Cruiser',
    
    // Sport / Performanță
    'GR Yaris', 'GR Supra', '86', 'GT86', 'GR86',
    'Celica', 'MR2', 'MR-S', 'MR2 Spyder',
    
    // Monovolume / MPV
    'Sienta', 'ProAce Verso',
    'Alphard', 'Vellfire',
    'Previa', 'Estima', 'Verso',
    
    // Pickup / Utilitare
    'Hilux', 'Tacoma', 'Tundra',
    'ProAce', 'Dyna', 'Hiace',
    
    // Electrice
    'bZ4X', 'bZ3', 'Proace Electric',
    
    // Hibride / Plug-in Hybrid (PHEV)
    'Prius Hybrid', 'Corolla Hybrid', 'Camry Hybrid',
    'RAV4 Hybrid', 'Yaris Hybrid', 'Highlander Hybrid', 'Sienna Hybrid',
    
    // Modele retrase / clasice notabile
    'Starlet', 'Carina', 'Corona', 'Crown',
    'Supra Mk3', 'Supra Mk4', 'Supra',
    'MR2 Mk1', 'MR2 Mk2', 'MR2 Mk3',
    'Paseo', 'Tercel', 'Cressida', 'Avalon'
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
    // Compacte / Hatchback / Sedan
    'Corsa', 'Corsa-e',
    'Astra', 'Astra Sports Tourer',
    'Insignia', 'Insignia Sports Tourer',
    'Adam', 'Karl', 'Viva',
    
    // SUV / Crossover
    'Mokka', 'Mokka-e',
    'Crossland', 'Grandland', 'Grandland PHEV',
    
    // Sport / Performanță
    'GT', 'Astra OPC', 'Corsa OPC',
    
    // Monovolume / MPV
    'Zafira', 'Zafira Life', 'Meriva', 'Combo Life',
    
    // Pickup / Utilitare
    'Combo', 'Movano', 'Vivaro',
    
    // Electrice & Hibride
    'Ampera', 'Ampera-e', 'Grandland X Hybrid',
    
    // Modele retrase / clasice notabile
    'Rekord', 'Kadett', 'Omega', 'Senator',
    'Ascona', 'Monza', 'Calibra',
    'Frontera', 'Tigra'
  ],

  // RENAULT - toate modelele disponibile
  renault: [
    // Compacte / Hatchback / Sedan
    'Twingo', 'Twingo Electric',
    'Clio', 'Clio E-Tech', 'Clio RS',
    'Zoe',
    'Megane', 'Megane E-Tech', 'Megane Sedan', 'Megane RS',
    'Fluence', 'Latitude', 'Talisman',
    'Symbol', 'Thalia',
    '9', '11',
    
    // SUV / Crossover
    'Captur', 'Captur E-Tech',
    'Arkana', 'Arkana E-Tech',
    'Kadjar', 'Koleos', 'Koleos PHEV', 'Austral',
    
    // Sport / Performanță
    'Alpine A110',
    
    // Monovolume / MPV
    'Scenic', 'Grand Scenic', 'Espace',
    'Kangoo', 'Kangoo ZE',
    'Trafic', 'Trafic EV',
    'Master', 'Master ZE',
    
    // Pickup / Utilitare
    'Alaskan',
    
    // Modele retrase / clasice notabile
    '4', '5', '6', '8', '10',
    '12', '16', '18', '19', '20',
    '21', '25', 'Fuego', '30'
  ],

  // PEUGEOT - toate modelele disponibile  
  peugeot: [
    // Compacte / Hatchback / Sedan
    '108',
    '208', '208 e', 'e-208',
    '308', '308 SW',
    '508', '508 SW', '508 PSE',
    '301',
    
    // SUV / Crossover
    '2008', '2008 e', 'e-2008',
    '3008', '3008 Hybrid', '3008 Hybrid4',
    '4008',
    '5008', '5008 Hybrid', '5008 Hybrid4',
    
    // Sport / Performanță
    'RCZ', 'RCZ R',
    '208 GTi', '308 GTi',
    
    // Monovolume / MPV
    'Rifter', 'e-Rifter',
    'Partner', 'Partner Tepee',
    'Traveller', 'Expert', 'e-Expert',
    
    // Modele retrase / clasice notabile
    '104', '204', '205',
    '206', '206 CC', '207',
    '306', '307',
    '405', '406', '407',
    '605', '607'
  ],

  // DACIA - modelele disponibile
  dacia: [
    // Compacte / Hatchback / Sedan
    'Dacia Logan',
    'Dacia Logan MCV',
    'Dacia Logan Stepway',
    'Dacia Sandero',
    'Dacia Sandero Stepway',
    'Dacia Dokker',
    
    // SUV / Crossover
    'Dacia Duster',
    'Dacia Duster 4×4',
    'Dacia Jogger',
    'Dacia Jogger Stepway',
    
    // Pickup / Utilitare
    'Dacia Dokker Van',
    'Dacia Logan Van',
    
    // Electrice & Hibride
    'Dacia Spring Electric',
    'Dacia Jogger Hybrid',
    
    // Modele retrase / clasice notabile
    'Dacia 1100', 'Dacia 1300',
    'Dacia 2000',
    'Dacia 1302', 'Dacia 1304',
    'Dacia 1305',
    'Dacia Nova'
  ],

  // SKODA - toate modelele disponibile
  skoda: [
    // Compacte / Hatchback / Sedan
    'Fabia', 'Fabia Combi',
    'Scala',
    'Rapid', 'Rapid Spaceback',
    'Octavia', 'Octavia Combi', 'Octavia RS', 'Octavia iV',
    'Superb', 'Superb Combi', 'Superb iV',
    'Citigo',
    
    // SUV / Crossover
    'Kamiq', 'Kamiq iV',
    'Karoq', 'Karoq iV',
    'Kodiaq', 'Kodiaq RS', 'Kodiaq iV',
    
    // Electrice
    'Enyaq iV', 'Enyaq Coupé iV',
    
    // Monovolume / Van
    'Roomster', 'Praktik',
    
    // Modele retrase / clasice notabile
    '1000 MB',
    '100', '110', '120',
    '105', '125',
    'Favorit',
    'Felicia', 'Felicia 1994', 'Felicia 1959',
    'Rapid 1935',
    'Octavia 1959'
  ],

  // SEAT - toate modelele disponibile
  seat: [
    // Compacte / Hatchback / Sedan
    'Ibiza', 'Ibiza FR', 'Ibiza Cupra',
    'Leon', 'Leon ST', 'Leon Estate', 'Leon Cupra', 'Leon Cupra R', 'Leon e-Hybrid',
    'Toledo',
    'Mii', 'Mii Electric',
    
    // SUV / Crossover
    'Arona',
    'Ateca', 'Ateca Cupra',
    'Tarraco', 'Tarraco e-Hybrid',
    
    // Electrice & Hibride
    'Cupra Born',
    
    // Modele retrase / clasice notabile
    'Marbella', 'Fura', 'Ronda', 'Malaga',
    'Alhambra', 'Cordoba'
  ],

  // HYUNDAI - toate modelele disponibile
  hyundai: [
    // Modele mici & compacte
    'i10', 'i20', 'i30', 'i30 Hatchback', 'i30 Wagon', 'i30 Fastback',
    'Accent', 'Verna', 'Elantra', 'Avante',
    'Getz', 'Atos', 'Atoz', 'Grand i10',
    'HB20', 'Excel', 'Pony', 'Stellar',
    
    // Modele sedan / berline
    'Sonata', 'Grandeur', 'Azera', 'Aslan',
    'Ioniq', 'Ioniq Hybrid', 'Ioniq Plug-in',
    'Xcent', 'Aura', 'Mistra', 'Lafesta',
    'Dynasty',
    
    // Modele SUV / Crossover
    'Tucson', 'Santa Fe', 'Kona', 'Kona Electric',
    'Creta', 'ix25', 'Venue', 'Palisade',
    'Bayon', 'Terracan', 'Galloper',
    'Veracruz', 'ix55', 'ix35',
    'Nexo',
    
    // Modele sport & performanță (Hyundai N)
    'i20 N', 'i30 N', 'i30 Fastback N',
    'Veloster N', 'Elantra N', 'Kona N',
    
    // MPV / Monovolume & familie
    'Staria', 'H-1', 'H-200', 'Starex',
    'Entourage', 'Matrix', 'Trajet',
    'Santamo', 'Lavita',
    
    // Pickup & utilitare
    'Santa Cruz', 'Porter', 'H-100',
    'Mighty', 'HD Series',
    
    // Modele electrice (IONIQ Series + EV)
    'IONIQ 5', 'IONIQ 6', 'IONIQ 7',
    'Ioniq Electric',
    
    // Modele doar pentru Coreea
    'Casper', 'Stargazer', 'Portico',
    'Click', 'Tuscani', 'Equus',
    
    // Modele clasice / retrase
    'Coupe', 'Tiburon', 'Scoupe',
    'Lantra', 'S-Coupe', 'Marcia', 'Sonica'
  ],

  // KIA - toate modelele disponibile
  kia: [
    // SUV / Crossover actuale (2025)
    'Sportage', 'Sorento', 'Seltos', 'Sonet', 'Telluride',
    'EV9', 'EV3', 'EV5', 'EV6',
    'Stonic', 'XCeed',
    
    // Compacte & Hatchback actuale
    'Ceed', 'Ceed SW', 'Proceed', 'Rio', 'Picanto',
    
    // Sedan / Berlina actuale
    'Stinger', 'K5', 'Optima', 'Forte', 'Cerato', 'Pegas',
    
    // Monovolum / Microvan actuale
    'Carnival', 'Sedona', 'Carens', 'Ray',
    
    // Modele electrice (EV)
    'EV3', 'EV4', 'EV5', 'EV6', 'EV9',
    'Soul EV', 'Niro EV',
    
    // Hibride & plug-in hybrid
    'Niro HEV', 'Niro PHEV',
    'Sorento HEV', 'Sorento PHEV',
    'Sportage HEV', 'Sportage PHEV',
    'Ceed PHEV', 'XCeed PHEV',
    
    // Modele retrase - SUV-uri
    'Borrego', 'Mohave', 'Soul',
    
    // Modele retrase - Hatchback & compacte
    'Cee\'d', 'Venga', 'Sephia', 'Shuma', 'Spectra',
    
    // Modele retrase - Sedan / Berlina
    'Magentis', 'Amanti', 'Opirus', 'Quoris', 'K900',
    
    // Modele sport / GT
    'Ceed GT', 'Stinger GT', 'Proceed GT'
  ],

  // NISSAN - toate modelele disponibile
  nissan: [
    // Compacte / Hatchback / Sedan
    'Micra', 'March',
    'Versa', 'Sunny', 'Almera',
    'Pulsar',
    'Sentra', 'Sylphy',
    'Altima', 'Maxima', 'Teana',
    
    // SUV / Crossover / Off-road
    'Juke', 'Qashqai', 'Rogue Sport',
    'X-Trail', 'Rogue',
    'Pathfinder', 'Murano',
    'Armada', 'Patrol',
    'Kicks',
    
    // Sport / Performanță
    '370Z', 'Fairlady Z',
    '350Z',
    'GT-R', 'R35',
    '200SX', 'Silvia',
    '300ZX',
    
    // Electrice
    'Leaf', 'Ariya',
    
    // Monovolume / Van
    'NV200', 'NV300', 'Serena', 'Quest',
    
    // Pickup / Utilitare
    'Navara', 'Frontier',
    'Titan',
    'NP300', 'D22', 'D40',
    'e-NV200',
    
    // Hibride / PHEV
    'Rogue e-Power', 'Note e-Power', 'Pathfinder e-Power',
    
    // Modele retrase / clasice notabile
    'Bluebird', 'Cedric', 'Laurel', 'Stagea',
    'Prairie', 'Terrano', 'Terrano II'
  ],

  // MAZDA - toate modelele disponibile
  mazda: [
    // Compacte & sedan - actuale
    'Mazda2', 'Demio',
    'Mazda3', 'Axela', 'Mazda3 Hatchback', 'Mazda3 Sedan', 'Mazda3 Fastback',
    'Mazda6', 'Atenza', 'Mazda6 Sedan', 'Mazda6 Wagon',
    
    // SUV & Crossover - actuale
    'CX-3', 'CX-30', 'CX-4', 'CX-5', 'CX-50',
    'CX-60', 'CX-7', 'CX-8', 'CX-9',
    
    // Sport & roadster
    'MX-5', 'Miata', 'MX-30', 'MX-6', 'MX-3',
    'RX-7', 'RX-8',
    
    // Modele retrase / clasice
    '121', '626', '929',
    'Capella', 'Cosmo', 'Familia', 'Luce', 'Carol',
    
    // Pickup & utilitare
    'B-Series', 'BT-50',
    
    // MPV & monovolum
    'MPV', 'Premacy', 'Mazda5',
    
    // SUV retrase
    'Tribute', 'Navajo'
  ],

  // VOLVO - toate modelele disponibile  
  volvo: [
    // Compacte / Hatchback / Sedan
    'S60', 'S60 Recharge',
    'S90', 'S90 Recharge',
    'V40', 'V40 Cross Country',
    'V60', 'V60 Recharge',
    'V90', 'V90 Recharge', 'V90 Cross Country',
    
    // SUV / Crossover
    'XC40', 'XC40 Recharge',
    'XC60', 'XC60 Recharge',
    'XC90', 'XC90 Recharge',
    
    // Sport / Performanță
    'C30', 'C70',
    'Polestar 1', 'Polestar 2',
    
    // Electrice
    'C40 Recharge',
    
    // Monovolume / MPV
    'V70', 'V70 XC', 'V70 Cross Country',
    '850', '940', '960',
    
    // Modele retrase / clasice notabile
    '240', '740', '760', '780',
    '480', '66', '164',
    'Amazon', '122'
  ],

  // LEXUS - toate modelele disponibile
  lexus: [
    // Sedan / Hatchback / Coupe
    'Lexus IS',
    'Lexus IS F',
    'Lexus ES',
    'Lexus GS',
    'Lexus GS F',
    'Lexus LS',
    'Lexus LC',
    'Lexus RC',
    'Lexus RC F',
    
    // SUV / Crossover
    'Lexus UX',
    'Lexus UX 250h',
    'Lexus NX',
    'Lexus NX 350h', 'Lexus NX 450h+',
    'Lexus RX',
    'Lexus RX 350h', 'Lexus RX 450h',
    'Lexus GX',
    'Lexus LX',
    'Lexus RZ',
    'Lexus LM',
    
    // Electrice & Hibride
    'Lexus LS 500h',
    'Lexus LC 500h',
    'Lexus RZ 450e',
    'Lexus HS 250h',
    
    // Modele retrase / clasice notabile
    'Lexus SC',
    'Lexus SC 430',
    'Lexus IS 200', 'Lexus IS 250', 'Lexus IS 300',
    'Lexus GS 300', 'Lexus GS 430', 'Lexus GS 450h',
    'Lexus LS 400', 'Lexus LS 430', 'Lexus LS 460'
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
    // SUV / Off-road / Crossover
    'Wrangler', 'Wrangler Unlimited', 'Wrangler 4xe',
    'Cherokee', 'Cherokee Trailhawk',
    'Grand Cherokee', 'Grand Cherokee L', 'Grand Cherokee 4xe',
    'Compass', 'Compass 4xe',
    'Renegade', 'Renegade 4xe',
    'Gladiator',
    'Avenger',
    
    // Electrice & Hibride (concepte și viitoare)
    'Recon', 'Magneto',
    
    // Modele retrase / clasice notabile
    'Wagoneer', 'CJ', 'CJ5', 'CJ7',
    'Liberty', 'Commander'
  ],

  // MINI - toate modelele disponibile
  mini: [
    // Compacte / Hatchback
    'One', 'Cooper', 'Cooper S', 'Cooper SE',
    'John Cooper Works', 'JCW',
    
    // SUV / Crossover
    'Countryman', 'Countryman Plug-in Hybrid',
    'Paceman',
    
    // Sport / Performanță
    'Cooper JCW GP', 'Cooper S GP',
    
    // Modele retrase / clasice
    'Classic', 'Mini Original',
    'Clubman', 'Clubman Classic',
    'Convertible'
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
    // Sedan / Hatchback / Coupe
    'Cadillac ATS',
    'Cadillac CTS',
    'Cadillac CT4',
    'Cadillac CT5',
    'Cadillac CT6',
    'Cadillac XLR',
    'Cadillac Eldorado',
    'Cadillac DeVille',
    'Cadillac Seville',
    
    // SUV / Crossover
    'Cadillac XT4',
    'Cadillac XT5',
    'Cadillac XT6',
    'Cadillac Escalade',
    'Cadillac Escalade ESV',
    
    // Sport / Performanță
    'Cadillac CT5-V',
    'Cadillac CT5-V Blackwing',
    'Cadillac CTS-V',
    'Cadillac CTS-V Wagon',
    'Cadillac V-Series',
    
    // Electrice & Hibride
    'Cadillac Lyriq',
    'Cadillac CT6 PHEV',
    'Cadillac Escalade PHEV',
    
    // Modele retrase / clasice notabile
    'Cadillac Series 62',
    'Cadillac Series 60',
    'Cadillac Series 70',
    'Cadillac Fleetwood',
    'Cadillac Brougham',
    'Cadillac Cimarron',
    'Cadillac Eldorado Biarritz'
  ],

  // CHEVROLET - americană mainstream
  chevrolet: [
    // Compacte / Hatchback / Sedan
    'Chevrolet Spark',
    'Chevrolet Aveo', 'Chevrolet Sonic',
    'Chevrolet Cruze',
    'Chevrolet Malibu',
    'Chevrolet Cavalier',
    
    // SUV / Crossover
    'Chevrolet Trax',
    'Chevrolet Tracker',
    'Chevrolet Equinox',
    'Chevrolet Blazer',
    'Chevrolet Tahoe',
    'Chevrolet Suburban',
    'Chevrolet Traverse',
    'Chevrolet Captiva',
    
    // Pickup / Utilitare
    'Chevrolet Colorado',
    'Chevrolet Silverado',
    'Chevrolet S-10',
    'Chevrolet Express',
    'Chevrolet Astro',
    
    // Electrice & Hibride
    'Chevrolet Bolt EV',
    'Chevrolet Bolt EUV',
    'Chevrolet Volt',
    'Chevrolet Malibu Hybrid',
    
    // Modele retrase / clasice notabile
    'Chevrolet Impala',
    'Chevrolet Bel Air',
    'Chevrolet Camaro',
    'Chevrolet Corvette',
    'Chevrolet Chevelle',
    'Chevrolet Caprice',
    'Chevrolet El Camino',
    'Chevrolet TrailBlazer'
  ],

  // CHRYSLER - americană
  chrysler: [
    // Sedan / Hatchback
    'Chrysler 300',
    'Chrysler 300C',
    'Chrysler 200',
    
    // SUV / Crossover / MPV
    'Chrysler Pacifica',
    'Chrysler Pacifica Hybrid',
    'Chrysler Voyager',
    'Chrysler Town & Country',
    'Chrysler Aspen',
    
    // Modele retrase / clasice notabile
    'Chrysler Imperial',
    'Chrysler Sebring',
    'Chrysler PT Cruiser',
    'Chrysler Crossfire'
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
    // Sedan / Hatchback / Coupe
    'Dodge Neon',
    'Dodge Dart',
    'Dodge Charger',
    'Dodge Challenger',
    
    // SUV / Crossover
    'Dodge Journey',
    'Dodge Durango',
    
    // Pickup / Utilitare
    'Dodge Ram',
    'Dodge Dakota',
    
    // Sport / Performanță
    'Dodge Viper',
    'Dodge SRT Hellcat',
    
    // Modele retrase / clasice notabile
    'Dodge Coronet',
    'Dodge Polara',
    'Dodge Magnum'
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
    // Modele actuale (2025) - Sedanuri & Berlina
    'XE', 'XF',
    
    // SUV-uri actuale
    'E-Pace', 'F-Pace',
    
    // Electrice
    'I-Pace',
    
    // Modele sportive actuale sau recente
    'F-Type', 'F-Type Coupé', 'F-Type Cabriolet',
    'XKR-S', 'XKR',
    
    // Sedanuri și limuzine retrase
    'XJ', 'XJ6', 'XJ8', 'XJR',
    'S-Type', 'X-Type',
    'Mark 2', 'Mark VII', 'Mark VIII', 'Mark IX',
    '420', '420G',
    
    // Sport & GT Clasic
    'E-Type',
    'XK120', 'XK140', 'XK150',
    'XK8', 'XK', 'XJS',
    
    // Supercar-uri și ediții rare
    'XJ220', 'XJR-15',
    'C-X75', 'D-Type', 'C-Type'
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
    // Modele actuale & recente
    'Ypsilon',
    
    // Modele iconice & sport
    'Delta', 'Delta Integrale', 'Stratos', 'Fulvia',
    
    // Sedanuri & berlina
    'Thema', 'Thesis', 'Lybra', 'Kappa', 'Dedra',
    
    // Compacte & monovolum
    'Musa', 'Phedra', 'Voyager',
    
    // Clasice legendare
    'Aurelia', 'Flavia', 'Flaminia', 'Appia',
    
    // Anii '70-'80
    'Beta', 'Beta Montecarlo', 'Prisma', 'Trevi', 'Zagato', 'Gamma',
    
    // Prewar & vintage
    'Ardea', 'Augusta', 'Artena', 'Astura'
  ],

  // LAND ROVER - SUV premium britanică
  'land rover': [
    // Defender - actual & variante
    'Defender', 'Defender 90', 'Defender 110', 'Defender 130',
    'Defender Works V8',
    
    // Discovery - actual & generații
    'Discovery', 'Discovery Sport',
    'Discovery 3', 'Discovery 4', 'LR3', 'LR4',
    'Discovery Vision Concept',
    
    // Range Rover - actual & variante
    'Range Rover', 'Range Rover Sport', 'Range Rover Velar', 'Range Rover Evoque',
    'Range Rover SVAutobiography', 'Range Rover Sport SVR',
    
    // Range Rover - generații clasice
    'Range Rover Classic', 'Range Rover P38', 'Range Rover L322', 'Range Rover L405',
    
    // Freelander
    'Freelander',
    
    // Clasice & heritage
    'Series I', 'Series II', 'Series III'
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
    // Compacte & sedan - actuale
    'Mirage', 'Space Star',
    'Lancer', 'Lancer Evolution', 'Evo',
    'Galant', 'Galant VR-4',
    
    // SUV & Crossover - actuale
    'Outlander', 'Outlander PHEV',
    'ASX', 'RVR', 'Outlander Sport',
    'Eclipse Cross', 'Eclipse Cross PHEV',
    
    // SUV mare & off-road
    'Pajero', 'Montero', 'Shogun',
    'Pajero Sport', 'Montero Sport', 'Shogun Sport',
    
    // Pickup
    'Triton', 'L200',
    
    // MPV & monovolum
    'Delica', 'Grandis', 'Space Wagon', 'Space Gear',
    
    // Compacte retrase
    'Colt', 'Carisma',
    
    // Sport & GT
    'Eclipse', '3000GT', 'GTO',
    
    // Electric
    'i-MiEV',
    
    // Modele retrase diverse
    '380', 'Sigma', 'Challenger'
  ],

  // MG - britanică (deținută de chinezi)
  mg: [
    'MG3', 'MG4 Electric', 'MG5 Electric',
    'MG HS', 'MG ZS', 'MG Marvel R',
    'MG TF', 'MG ZR', 'MG ZT'
  ],

  // PORSCHE - premium sportivă germană
  porsche: [
    // Sport / Coupe - 911 Series
    '911', '911 Carrera', '911 Carrera S', '911 Carrera 4', '911 Carrera 4S',
    '911 Targa', '911 Turbo', '911 Turbo S',
    '911 GT3', '911 GT3 RS', '911 GT2 RS', '911 GTS',
    
    // Sport / Coupe - 718 Series
    '718 Cayman', '718 Cayman T', '718 Cayman GTS',
    '718 Boxster', '718 Boxster T', '718 Boxster GTS',
    
    // SUV / Crossover
    'Macan', 'Macan S', 'Macan GTS', 'Macan Turbo',
    'Cayenne', 'Cayenne S', 'Cayenne GTS', 'Cayenne Turbo', 'Cayenne Turbo S E-Hybrid',
    'Cayenne Coupe',
    
    // Electrice & Hybrid
    'Taycan', 'Taycan 4S', 'Taycan Turbo', 'Taycan Turbo S',
    'Taycan Cross Turismo',
    'Panamera 4 E-Hybrid', 'Panamera 4S E-Hybrid', 'Panamera Turbo S E-Hybrid',
    
    // Monovolume / alte modele speciale
    'Panamera', 'Panamera GTS', 'Panamera Turbo',
    
    // Modele retrase / clasice notabile
    '356', '914', '924', '928', '944', '968',
    'Carrera GT', '959', '918 Spyder'
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
    // Compacte / Hatchback / Sedan - Clasice
    '92', '93', '94', '95', '96',
    '97', 'Sonett I', 'Sonett II', 'Sonett III',
    '99', '99 Turbo',
    '900', '900 Turbo',
    '9000',
    
    // Modele moderne
    '9-3', '9-3 Convertible', '9-3 SportCombi', '9-3 Aero', '9-3 EV',
    '9-5', '9-5 Aero',
    
    // SUV / Crossover
    '9-4X', '9-7X',
    
    // Concepte / Hibride
    '9-X BioHybrid'
  ],

  // SSANGYONG - coreeană SUV
  ssangyong: [
    'Tivoli', 'Korando', 'Rexton', 'Musso',
    'XLV', 'Rodius'
  ],

  // SUBARU - japoneză AWD
  subaru: [
    // Compacte / Hatchback / Sedan
    'Impreza', 'Impreza WRX', 'Impreza WRX STI',
    'WRX', 'WRX STI',
    'BRZ',
    
    // SUV / Crossover / Off-road
    'XV', 'Crosstrek', 'XV Hybrid', 'XV e-Boxer',
    'Forester', 'Forester e-Boxer',
    'Outback',
    'Ascent',
    'Tribeca',
    
    // Pickup / Utilitare
    'Baja',
    
    // Electrice & Hibride
    'Solterra', 'Crosstrek Hybrid',
    
    // Modele retrase / clasice notabile
    '360', 'Leone', 'Alcyone', 'XT', 'Justy', 'Legacy', 'Levorg'
  ],

  // SUZUKI - pentru autoturisme
  'suzuki': [
    // Compacte / Hatchback / Sedan
    'Alto', 'Celerio',
    'Swift', 'Swift Sport', 'Swift Hybrid',
    'Baleno',
    'Ignis', 'Ignis Hybrid',
    'Splash',
    
    // SUV / Crossover / Off-road
    'Vitara', 'Vitara Hybrid', 'Vitara Brezza',
    'Grand Vitara',
    'S-Cross', 'S-Cross Hybrid',
    'XL7',
    'Jimny', 'Jimny Sierra',
    
    // Pickup / Utilitare
    'Carry', 'Super Carry',
    
    // Electrice & Hibride
    'Across',
    
    // Modele retrase / clasice notabile
    'SJ', 'Samurai', 'Sidekick',
    'Esteem', 'Forenza',
    'Baleno Sedan', 'Wagon R+',
    'SX4', 'Kizashi'
  ],

  // TESLA - vehicule electrice
  tesla: [
    // Sedan / Hatchback
    'Model S', 'Model S Plaid',
    'Model 3', 'Model 3 Performance',
    
    // SUV / Crossover
    'Model X', 'Model X Plaid',
    'Model Y', 'Model Y Performance',
    
    // Pickup / Utilitare
    'Cybertruck',
    
    // Electrice & High Performance
    'Roadster', 'Roadster 2008', 'Roadster 2023'
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