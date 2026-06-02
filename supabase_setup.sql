-- Créer la table menu_items
create table public.menu_items (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text not null default '',
  category    text not null check (category in ('entrees', 'plats', 'desserts', 'boissons')),
  price       numeric(8,2) not null default 0,
  ingredients text[] not null default '{}',
  allergens   text[] not null default '{}',
  image_emoji text not null default '🍽️',
  is_available boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Autoriser tout le monde à LIRE (clients)
create policy "lecture_publique" on public.menu_items
  for select using (true);

-- Activer Row Level Security
alter table public.menu_items enable row level security;

-- Autoriser les opérations d'écriture sans authentification (admin via mot de passe hardcodé)
-- IMPORTANT : cette politique autorise l'écriture depuis n'importe qui.
-- Pour un vrai projet en production, utiliser Supabase Auth.
create policy "ecriture_admin" on public.menu_items
  for all using (true) with check (true);

-- Insérer les plats par défaut
insert into public.menu_items (name, description, category, price, ingredients, allergens, image_emoji, is_available) values
  ('Salade Niçoise Dorée',        'Salade fraîche aux légumes méditerranéens avec vinaigrette maison',            'entrees',  12.50, array['Laitue romaine','Tomates cerises','Thon','Olives noires','Œufs durs','Anchois','Vinaigrette citron-huile d''olive'], array['Poisson','Œufs','Moutarde'],                           '🥗',  true),
  ('Velouté de Courge',           'Velouté onctueux de courge butternut aux épices douces',                       'entrees',  10.00, array['Courge butternut','Crème fraîche','Bouillon de légumes','Noix de muscade','Gingembre'],                               array['Lait / Lactose','Céleri'],                               '🍲',  true),
  ('Tartare de Saumon',           'Saumon frais mariné aux herbes et câpres, servi avec toast grillé',            'entrees',  15.00, array['Saumon frais','Câpres','Échalotes','Aneth','Citron','Moutarde de Dijon','Pain de campagne'],                           array['Poisson','Gluten (blé)','Moutarde'],                     '🐟',  true),
  ('Filet de Bœuf El Dorado',     'Filet de bœuf grillé sauce au poivre, accompagné de légumes rôtis',           'plats',    28.00, array['Filet de bœuf 200g','Sauce au poivre vert','Pommes de terre grenaille','Haricots verts','Thym','Romarin'],               array['Lait / Lactose','Céleri'],                               '🥩',  true),
  ('Poulet Rôti aux Herbes',      'Poulet fermier rôti entier aux herbes de Provence, jus naturel',               'plats',    22.00, array['Poulet fermier','Herbes de Provence','Ail','Citron','Huile d''olive','Pommes de terre','Carottes'],                    array['Céleri'],                                                '🍗',  true),
  ('Daurade Royale Grillée',      'Daurade entière grillée au four, beurre blanc au citron',                      'plats',    26.00, array['Daurade royale 400g','Beurre','Citron','Vin blanc','Échalotes','Persil','Riz basmati'],                                 array['Poisson','Lait / Lactose','Sulfites (alcool)'],           '🐠',  true),
  ('Risotto aux Champignons',     'Risotto crémeux aux champignons sauvages et parmesan affiné',                  'plats',    19.00, array['Riz Arborio','Champignons sauvages','Parmesan','Bouillon de volaille','Vin blanc','Échalotes','Beurre'],                  array['Lait / Lactose','Gluten (traces)','Sulfites (alcool)'],   '🍚',  true),
  ('Fondant au Chocolat',         'Cœur coulant au chocolat noir Valrhona, glace vanille bourbon',                'desserts',  9.00, array['Chocolat noir 70%','Beurre','Œufs','Sucre','Farine','Glace vanille','Coulis de framboise'],                             array['Gluten (blé)','Lait / Lactose','Œufs'],                  '🫕',  true),
  ('Crème Brûlée à la Vanille',   'Crème brûlée traditionnelle à la vanille de Madagascar',                       'desserts',  8.00, array['Crème entière','Jaunes d''œufs','Vanille de Madagascar','Sucre','Cassonade'],                                         array['Lait / Lactose','Œufs'],                                 '🍮',  true),
  ('Tarte Tatin aux Pommes',      'Tarte renversée caramélisée aux pommes Granny Smith',                          'desserts',  8.50, array['Pommes Granny Smith','Pâte feuilletée','Beurre','Sucre','Cannelle','Crème fraîche'],                                   array['Gluten (blé)','Lait / Lactose','Œufs'],                  '🎂',  true),
  ('Cocktail Sun El Dorado',      'Notre signature : rhum doré, jus de mangue, citron vert et gingembre',         'boissons',  9.00, array['Rhum doré','Jus de mangue frais','Citron vert','Gingembre frais','Sirop de canne','Glace pilée'],                      array['Sulfites (alcool)'],                                     '🍹',  true),
  ('Jus de Fruits Tropicaux',     'Mélange frais de fruits tropicaux pressés à la minute',                        'boissons',  6.50, array['Mangue','Ananas','Papaye','Fruit de la passion','Citron vert'],                                                         array[],                                                        '🥭',  true),
  ('Eau Minérale',                'Eau minérale naturelle plate ou pétillante',                                   'boissons',  3.00, array['Eau minérale naturelle'],                                                                                               array[],                                                        '💧',  true),
  ('Café & Infusions',            'Espresso, café allongé ou sélection de thés et infusions',                     'boissons',  4.00, array['Café Arabica','Thé Earl Grey','Tisane camomille-menthe','Sucre','Lait (optionnel)'],                                    array['Lait / Lactose (optionnel)'],                             '☕',  true);
