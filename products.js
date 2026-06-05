const EXTRA_PRICE = 1.00;

// ── Rakenna oma pizza -hinnat ──────────────────────────
const BASE_PIZZA_PRICE  = 8.00;   // pohja (tomaatti + mozzarella)
const PB_SAUCE_EXTRA    = 0.50;   // kastike (ei tomaatti)
const PB_CHEESE_EXTRA   = EXTRA_PRICE;
const PB_TOPPING_PRICE  = EXTRA_PRICE;
const PB_FAMILY_EXTRA   = 7.00;   // perhepizza lisähinta

const EXTRAS = [
  'Ananas', 'Herkkusieni', 'Katkarapu', 'Aurajuusto', 'Pizzasuikale',
  'Kebab', 'Jalapeño', 'Maissi', 'Jauheliha', 'Salami',
  'Mozzarella', 'Currykastike', 'Simpukka', 'Kana', 'Oliivi',
  'Kanamuna', 'Fetajuusto', 'Sipuli', 'Paprika', 'Tomaatti',
  'Pekoni', 'Tonnikala', 'Pepperoni',
];

const PRODUCTS = [

  // ── PIZZAT ──────────────────────────────────────────
  { id: 'margherita',      category: 'pizzat', name: 'Margherita',      ingredients: 'Tomaatti',                                            price: 9.00,  img: 'https://imageproxy.wolt.com/assets/68f9d94852f5fcdd085a890d?w=600', badge: null },
  { id: 'roma',            category: 'pizzat', name: 'Roma',            ingredients: 'Jauheliha',                                           price: 9.50,  img: 'https://imageproxy.wolt.com/assets/68f9d98ecd0321dabf32d6d0?w=600', badge: null },
  { id: 'tropicana',       category: 'pizzat', name: 'Tropicana',       ingredients: 'Pizzasuikale, ananas',                                price: 10.00, img: 'https://imageproxy.wolt.com/assets/68f9d9a052f5fcdd085a8940?w=600', badge: null },
  { id: 'opera',           category: 'pizzat', name: 'Opera',           ingredients: 'Pizzasuikale, tonnikala',                             price: 10.00, img: 'https://imageproxy.wolt.com/assets/68f9d9a852f5fcdd085a8945?w=600', badge: null },
  { id: 'opera-special',   category: 'pizzat', name: 'Opera Special',   ingredients: 'Pizzasuikale, tonnikala, salami',                     price: 10.00, img: 'https://imageproxy.wolt.com/assets/68f9da1dcd0321dabf32d71f?w=600', badge: null },
  { id: 'calzone',         category: 'pizzat', name: 'Calzone',         ingredients: 'Kananmuna, tuplajuusto, currykastike',                price: 10.00, img: 'https://imageproxy.wolt.com/assets/68f9da17cd0321dabf32d71e?w=600', badge: null },
  { id: 'capricciosa',     category: 'pizzat', name: 'Capricciosa',     ingredients: 'Pizzasuikale, salami, herkkusieni',                   price: 10.00, img: 'https://imageproxy.wolt.com/assets/68f9da29cd0321dabf32d723?w=600', badge: null },
  { id: 'americana',       category: 'pizzat', name: 'Americana',       ingredients: 'Pizzasuikale, ananas, aurajuusto',                    price: 10.00, img: 'https://imageproxy.wolt.com/assets/68f9da45f070793ad1fdf837?w=600', badge: null },
  { id: 'diavola',         category: 'pizzat', name: 'Diavola',         ingredients: 'Pepperoni, pizzasuikale, ananas',                     price: 10.00, img: 'https://imageproxy.wolt.com/assets/68f9db1652f5fcdd085a89a6?w=600', badge: null },
  { id: 'hot-pizza',       category: 'pizzat', name: 'Hot Pizza',       ingredients: 'Kana, pepperoni, valkosipulikastike',                 price: 10.00, img: 'https://imageproxy.wolt.com/assets/68f9db8acd0321dabf32d78e?w=600', badge: 'SUOSITTU' },
  { id: 'mexicana',        category: 'pizzat', name: 'Mexicana',        ingredients: 'Pepperoni, jalapeno, ananas, chilikastike',           price: 11.00, img: 'https://imageproxy.wolt.com/assets/68f9da2fcd0321dabf32d724?w=600', badge: 'SUOSITTU' },
  { id: 'quattro',         category: 'pizzat', name: 'Quattro stagioni', ingredients: 'Pizzasuikale, tonnikala, katkarapu, herkkusieni',    price: 11.00, img: 'https://imageproxy.wolt.com/assets/68f9da40cd0321dabf32d728?w=600', badge: null },
  { id: 'alla-pollo',      category: 'pizzat', name: 'Alla Pollo',      ingredients: 'Kana, fetajuusto, tomaatti, aurajuusto',             price: 11.00, img: 'https://imageproxy.wolt.com/assets/68f9da9952f5fcdd085a8989?w=600', badge: null },
  { id: 'kebabpizza',      category: 'pizzat', name: 'Kebabpizza',      ingredients: 'Kebab, sipuli, valkosipuli, herkkusieni',            price: 11.00, img: 'https://imageproxy.wolt.com/assets/68f9db0152f5fcdd085a899f?w=600', badge: 'SUOSITTU' },
  { id: 'vegetariana',     category: 'pizzat', name: 'Vegetariana',     ingredients: 'Paprika, herkkusieni, tomaatti, ananas, sipuli, oliivi', price: 11.00, img: 'https://imageproxy.wolt.com/assets/68f9db2acd0321dabf32d77a?w=600', badge: null },
  { id: 'pekonipizza',     category: 'pizzat', name: 'Pekonipizza',     ingredients: 'Pekoni, kebab, sipuli, paprika',                     price: 11.00, img: 'https://imageproxy.wolt.com/assets/68f9db3fcd0321dabf32d781?w=600', badge: null },
  { id: 'frutti-di-mare',  category: 'pizzat', name: 'Frutti di Mare',  ingredients: 'Tonnikala, katkarapu, simpukka',                     price: 11.00, img: 'https://imageproxy.wolt.com/assets/68f9db31cd0321dabf32d77b?w=600', badge: null },
  { id: 'halal-pizza',     category: 'pizzat', name: 'Halal Pizza',     ingredients: 'Kana, kebab, tomaatti, paprika',                     price: 11.00, img: 'https://imageproxy.wolt.com/assets/68f9db8ecd0321dabf32d790?w=600', badge: null },
  { id: 'hietalahti-sp',   category: 'pizzat', name: 'Hietalahti Special', ingredients: 'Kebab, fetajuusto, aurajuusto, kana',            price: 11.00, img: 'https://imageproxy.wolt.com/assets/68f9db4ccd0321dabf32d784?w=600', badge: 'SUOSITTU' },
  { id: 'kebab-special',   category: 'pizzat', name: 'Kebab Special',   ingredients: 'Kebab, fetajuusto, kana, valkosipuli, aurajuusto',  price: 12.00, img: 'https://imageproxy.wolt.com/assets/68f9db1ecd0321dabf32d773?w=600', badge: null },

  // ── SALAATIT ────────────────────────────────────────
  { id: 'salaatti',        category: 'salaatit', name: 'Salaatti',          ingredients: 'Jäävuorisalaatti, fetajuusto, oliivi, kurkku, tomaatti, sipuli',       price: 8.00,  img: 'https://imageproxy.wolt.com/assets/69ce41b6867374336bc47cbc?w=600', badge: null },
  { id: 'makkara-sal',     category: 'salaatit', name: 'Makkarasalaatti',   ingredients: 'Makkara, jäävuorisalaatti, fetajuusto, oliivi, kurkku, tomaatti',      price: 10.00, img: 'https://imageproxy.wolt.com/assets/69ce41b6867374336bc47cbd?w=600', badge: null },
  { id: 'katkarapu-sal',   category: 'salaatit', name: 'Katkarapusalaatti', ingredients: 'Katkarapu, jäävuorisalaatti, fetajuusto, oliivi, kurkku, tomaatti',    price: 12.00, img: 'https://imageproxy.wolt.com/assets/68f9dbbdcd0321dabf32d7a1?w=600', badge: null },
  { id: 'kana-sal',        category: 'salaatit', name: 'Kanasalaatti',      ingredients: 'Kana, jäävuorisalaatti, fetajuusto, oliivi, kurkku, tomaatti',         price: 10.00, img: 'https://imageproxy.wolt.com/assets/68f9dbbfcd0321dabf32d7a4?w=600', badge: null },
  { id: 'kebab-sal',       category: 'salaatit', name: 'Kebabsalaatti',     ingredients: 'Kebab, jäävuorisalaatti, fetajuusto, oliivi, kurkku, tomaatti',        price: 10.00, img: 'https://imageproxy.wolt.com/assets/68f9dbd2cd0321dabf32d7aa?w=600', badge: 'SUOSITTU' },
  { id: 'falafel-sal',     category: 'salaatit', name: 'Falafelsalaatti',   ingredients: 'Falafel, jäävuorisalaatti, fetajuusto, oliivi, kurkku, tomaatti',      price: 10.00, img: 'https://imageproxy.wolt.com/assets/68f9dbd9cd0321dabf32d7ab?w=600', badge: null },

  // ── GRILLIANNOKSET ──────────────────────────────────
  { id: 'hampurilais',     category: 'grilliannokset', name: 'Hampurilaisateria',  ingredients: 'Jauhelihapihvi, sämpylä, tomaatti, sipuli, suolakurkku, juusto, hampurilaiskastike, ranskalaiset', price: 10.00, img: 'https://imageproxy.wolt.com/assets/68f9dbfdf070793ad1fdf8ab?w=600', badge: null },
  { id: 'smashburger',     category: 'grilliannokset', name: 'Smashburger Ateria', ingredients: 'Jauhelihapihvi, sämpylä, tomaatti, sipuli, suolakurkku, juusto, hampurilaiskastike, ranskalaiset', price: 12.00, img: 'https://imageproxy.wolt.com/assets/68f9dc02f070793ad1fdf8af?w=600', badge: 'SUOSITTU' },
  { id: 'kanaburger',      category: 'grilliannokset', name: 'Kanaburger Ateria',  ingredients: 'Kanapihvi, sämpylä, tomaatti, sipuli, suolakurkku, juusto, hampurilaiskastike, ranskalaiset',     price: 10.00, img: 'https://imageproxy.wolt.com/assets/68f9dc08f070793ad1fdf8b1?w=600', badge: null },
  { id: 'vegeburger',      category: 'grilliannokset', name: 'Vegeburger Ateria',  ingredients: 'Kanapihvi, sämpylä, tomaatti, sipuli, suolakurkku, juusto, hampurilaiskastike, ranskalaiset',     price: 10.00, img: 'https://imageproxy.wolt.com/assets/68f9dc17f070793ad1fdf8b6?w=600', badge: null },
  { id: 'makkaraperunat',  category: 'grilliannokset', name: 'Makkaraperunat',     ingredients: 'Makkara, ranskalaiset, ketsuppi, sinappi',                                                         price: 10.00, img: 'https://imageproxy.wolt.com/assets/68f9dc24f070793ad1fdf8bb?w=600', badge: null },

  // ── KANA-ANNOKSET ────────────────────────────────────
  { id: 'kana-riisi',      category: 'kana', name: 'Kana riisillä',      ingredients: 'Kana, riisi, tomaatti, suolakurkku, jäävuorisalaatti, kastike',  price: 11.00, img: 'https://imageproxy.wolt.com/assets/68f9dc3452f5fcdd085a89fc?w=600', badge: null },
  { id: 'pita-kana',       category: 'kana', name: 'Pita kana',          ingredients: 'Kana, pitaleipä, tomaatti, kurkku, jäävuorisalaatti, kastike',   price: 11.00, img: 'https://imageproxy.wolt.com/assets/68f9dc3652f5fcdd085a89fd?w=600', badge: null },
  { id: 'kana-ranskalaiset', category: 'kana', name: 'Kana ranskalaisilla', ingredients: 'Kana, ranskalaiset, tomaatti, suolakurkku, jäävuorisalaatti, kastike', price: 11.00, img: 'https://imageproxy.wolt.com/assets/68f9dc3252f5fcdd085a89fb?w=600', badge: null },

  // ── RULLAT ──────────────────────────────────────────
  { id: 'kebabrulla',      category: 'rullat', name: 'Kebabrulla',    ingredients: 'Kebab, tomaatti, kurkku, sipuli, jäävuorisalaatti, kastike',        price: 11.00, img: 'https://imageproxy.wolt.com/assets/68f9dc3c52f5fcdd085a89ff?w=600', badge: 'SUOSITTU' },
  { id: 'falafelrulla',    category: 'rullat', name: 'Falafelrulla',  ingredients: 'Falafel, tomaatti, kurkku, sipuli, jäävuorisalaatti, kastike',      price: 11.00, img: 'https://imageproxy.wolt.com/assets/68f9dc3c52f5fcdd085a89ff?w=600', badge: null },
  { id: 'kanarulla',       category: 'rullat', name: 'Kanarulla',     ingredients: 'Kana, tomaatti, kurkku, sipuli, jäävuorisalaatti, kastike',         price: 11.00, img: 'https://imageproxy.wolt.com/assets/68f9dc3c52f5fcdd085a89ff?w=600', badge: null },
  { id: 'pekonirulla',     category: 'rullat', name: 'Pekonirulla',   ingredients: 'Pekoni, tomaatti, kurkku, sipuli, jäävuorisalaatti, kastike',       price: 12.00, img: 'https://imageproxy.wolt.com/assets/68f9dc3c52f5fcdd085a89ff?w=600', badge: null },
  { id: 'kinkkurulla',     category: 'rullat', name: 'Kinkkurulla',   ingredients: 'Pizzasuikale, tomaatti, kurkku, sipuli, jäävuorisalaatti, kastike', price: 12.00, img: 'https://imageproxy.wolt.com/assets/68f9dc3c52f5fcdd085a89ff?w=600', badge: null },
  { id: 'jauheliharulla',  category: 'rullat', name: 'Jauheliharulla', ingredients: 'Jauheliha, tomaatti, kurkku, sipuli, jäävuorisalaatti, kastike',  price: 12.00, img: 'https://imageproxy.wolt.com/assets/68f9dc3c52f5fcdd085a89ff?w=600', badge: null },

];
