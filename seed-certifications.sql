-- =============================================
-- DATA SEED: CERTIFICATIONS
-- Run this script in the Supabase SQL Editor
-- =============================================

INSERT INTO certifications (
  institution, 
  name, 
  date, 
  issuer, 
  image_url, 
  order_index
)
VALUES
  (
    'Google Digital Garage',
    'Fundamentals of Digital Marketing',
    '2023-01-01',
    'Google',
    'https://placehold.co/600x400/1a1a1a/electric?text=Google+Digital+Garage',
    0
  ),
  (
    'LinkedIn',
    'Data Analytics',
    '2023-01-01',
    'LinkedIn',
    'https://placehold.co/600x400/0077b5/white?text=LinkedIn+Learning',
    1
  ),
  (
    'Schneider Electric',
    'GDPR (General Data Protection Regulation)',
    '2024-01-01',
    'Schneider Electric',
    'https://placehold.co/600x400/3dcd58/white?text=Schneider+Electric',
    2
  ),
  (
    'NVIDIA',
    'GTC 2023',
    '2023-01-01',
    'NVIDIA',
    'https://placehold.co/600x400/76b900/white?text=NVIDIA+GTC',
    3
  ),
  (
    'NPTEL',
    'Production & Operations Management',
    '2022-01-01',
    'NPTEL',
    'https://placehold.co/600x400/f05a28/white?text=NPTEL+Certification',
    4
  ),
  (
    'NISM',
    'Kona Kona Shiksha',
    '2022-01-01',
    'NISM',
    'https://placehold.co/600x400/2a2a2a/white?text=NISM+Certification',
    5
  );
