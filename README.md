<div align="center">
  <img src="./assets/images/splash.png" alt="Jiwar Logo" width="200" height="200">
  <h1>Jiwar | Luxury Real Estate</h1>
  <p><strong>A production-grade, full-stack real estate platform built for scale, performance, and aesthetic excellence.</strong></p>
  
  <p>
    <a href="https://reactnative.dev/"><img src="https://img.shields.io/badge/React_Native-0.76-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" /></a>
    <a href="https://expo.dev/"><img src="https://img.shields.io/badge/Expo-54-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" /></a>
    <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" /></a>
    <a href="https://clerk.com/"><img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  </p>
</div>

---

## 📖 Overview

Jiwar is a premium, cross-platform mobile application tailored for the luxury real estate market. Engineered with a focus on buttery-smooth interactions and a strict "Emerald & Pine" design system, it delivers an editorial-grade user experience on both iOS and Android.

Unlike typical MVP applications, Jiwar implements a rigorous production architecture:
- **Zero-Friction Auth**: Headless authentication flows via Clerk, fully integrated with Supabase Row Level Security (RLS).
- **Offline-First Resilience**: Global state hydrated through Zustand with intelligent query caching.
- **Performant Cartography**: Native-feeling Map integrations via OpenStreetMap and optimized WebViews.
- **Bespoke Design Token System**: A completely custom inline styling engine, ditching heavy utility frameworks for raw performance and pixel-perfect consistency.

---

## 🏗 System Architecture

Jiwar follows a strict unidirectional data flow and clean separation of concerns.

```mermaid
graph TD
    %% Client Tier
    subgraph Client [📱 Client App]
        UI[React Native / Expo Router]
        Store[Zustand Global State]
        Hooks[Custom Hooks]
        Services[Service Layer]
    end

    %% Auth Tier
    subgraph Identity [🔐 Identity Provider]
        Clerk[Clerk Auth JWT]
    end

    %% Data Tier
    subgraph Backend [🗄 Backend Services]
        Supabase[(Supabase PostgreSQL)]
        Storage[Supabase Object Storage]
        RLS{Row Level Security}
    end

    %% Flow
    UI <--> Store
    UI <--> Hooks
    Hooks --> Services
    UI -- "Login/Signup" --> Clerk
    Clerk -- "Returns JWT" --> Hooks
    Services -- "Authenticated Requests" --> RLS
    RLS -- "Validates Token" --> Supabase
    RLS -- "Validates Token" --> Storage
```

---

## 🎨 The "Emerald & Pine" Design System

We deliberately moved away from generic utility classes to implement a strict, scalable token system. This guarantees that every shadow, radius, and color perfectly aligns with the luxury brand identity across all OS paradigms.

- **Primary Axis**: Deep Pine (`#08383C`) providing a heavy, grounded corporate feel.
- **Accents**: Sage White (`#F5F8F6`) for expansive negative space, and Lime (`#4ADE80`) for high-contrast CTAs.
- **Kinematics**: Global `KeyboardAvoidingView` strategies ensure inputs are never obscured, providing a flawless administrative and registration experience.

---

## ⚖️ React Native vs React — What Changes

If you are transitioning from web development, the component swap is the only real hurdle. Once that mapping is in your head, everything else — state, effects, data fetching, routing — works exactly as it does in standard React.

| Concept             | React (Web)                      | React Native                              | Notes                                                                             |
| ------------------- | -------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------- |
| **Container / div** | `<div>`                          | `<View>`                                  | The fundamental layout block. Uses Flexbox by default.                            |
| **Text**            | `<p>`, `<h1>` – `<h6>`, `<span>` | `<Text>`                                  | Every string must be inside `<Text>`. No bare text nodes.                         |
| **Image**           | `<img src="…">`                  | `<Image source={{ uri: '…' }} />`         | Requires explicit `width` and `height` or a flex style.                           |
| **Button**          | `<button>`                       | `<TouchableOpacity>` / `<Pressable>`      | Gives full control over the pressed appearance. `<Button>` exists but is minimal. |
| **Scrollable list** | `<ul>` + CSS overflow            | `<ScrollView>` / `<FlatList>`             | `FlatList` is preferred for long lists — it virtualizes rows for performance.     |
| **Text input**      | `<input type="text">`            | `<TextInput>`                             | `onChangeText` instead of `onChange`. No synthetic event object needed.           |
| **Click / tap**     | `onClick`                        | `onPress`                                 | Works for `TouchableOpacity`, `Pressable`, and most interactive components.       |
| **Navigation**      | React Router / Next.js           | Expo Router (file-based, same convention) | Same file-based concept as Next.js App Router.                                    |
| **Safe area**       | Not needed (browser handles it)  | `<SafeAreaView>`                          | Prevents content from sitting under the notch or home indicator.                  |

---

## 🚀 Quick Start & Development

<details>
<summary><strong>1. Prerequisites</strong></summary>

- Node.js (v18 or higher)
- Expo CLI (`npm i -g expo-cli`)
- EAS CLI (`npm i -g eas-cli`)
- Clerk & Supabase Accounts
</details>

<details>
<summary><strong>2. Environment Configuration</strong></summary>

Clone the repository and create your `.env` file at the root:
```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_SUPABASE_URL=https://...supabase.co
EXPO_PUBLIC_SUPABASE_KEY=eyJhbG...
```
</details>

<details>
<summary><strong>3. Local Development</strong></summary>

```bash
npm install
npx expo start -c
```
</details>

<details>
<summary><strong>4. Compiling Native Binaries (APK / IPA)</strong></summary>

Jiwar is fully configured for Expo Application Services (EAS).
```bash
# Compile a standalone Android APK
eas build --profile preview --platform android --local
```
</details>

---

## 📂 Project Structure & Anatomy

```text
jiwar/
├── app/
│   ├── _layout.tsx              ← Root wrapper (Clerk auth setup)
│   ├── (auth)/                  ← Auth route group
│   │   ├── _layout.tsx
│   │   ├── sign-in.tsx          ← Login screen
│   │   └── sign-up.tsx          ← Register screen
│   └── (root)/                  ← Protected routes (post-login)
│       ├── _layout.tsx
│       ├── (tabs)/              ← Bottom tab navigation
│       │   ├── _layout.tsx      ← Tab navigator setup
│       │   ├── index.tsx        ← Home screen
│       │   ├── explore.tsx      ← Search & filter screen
│       │   ├── add.tsx          ← Add listing screen (admin)
│       │   ├── favorites.tsx    ← Saved/favourites screen
│       │   └── profile.tsx      ← User profile screen
│       └── property/
│           ├── [id].tsx         ← Property detail (dynamic route)
│           └── map.tsx          ← Full map view
├── components/
│   ├── PropertyCard.tsx         ← Vertical property listing card
│   ├── FeaturedCard.tsx         ← Horizontal featured carousel card
│   └── FilterModal.tsx          ← Advanced search & filtering bottom sheet
├── constants/
│   └── filters.ts               ← Property type, bedroom, and price constants
├── hooks/
│   ├── useSupabase.ts           ← Authenticated Supabase client
│   ├── useSavedProperty.ts      ← Save / unsave a property
│   └── useUserSync.ts           ← Syncs Clerk user → Supabase
├── lib/
│   ├── supabase.ts              ← Supabase client setup
│   └── utils.ts                 ← Helper functions (formatPrice…)
├── services/
│   ├── properties.ts            ← fetchProperties, searchProperties
│   └── saved.ts                 ← checkIfPropertySaved, saveProperty, unsaveProperty
├── store/
│   ├── filterStore.ts           ← Search filter state (Zustand)
│   └── userStore.ts             ← User/admin state (Zustand)
├── types/
│   └── index.ts                 ← Shared interfaces & types
└── app.json                     ← Expo config
```

---

## 🧩 Architectural Breakdown

### 🔑 Types (`types/index.ts`)
Shared domain types used across screens, stores, and constants to ensure strict type safety.

```ts
export type PropertyTypeValue = "apartment" | "house" | "villa" | "studio" | "townhouse" | "penthouse" | "plot" | "flat" | "other";

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: PropertyTypeValue;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  images: string[];
  is_featured: boolean;
  is_sold: boolean;
  created_at: string;
}
```

### 🌐 Global State (`store/`)
Zustand is used for frictionless global state management, avoiding the overhead of heavy prop drilling.
- **`filterStore.ts`**: Maintains the active search query, property type, bedroom count, and budget constraints (`minPrice`/`maxPrice`).
- **`userStore.ts`**: Tracks the user session and `isAdmin` flag to dynamically reveal administrative capabilities (like the Add Listing tab).

### 🪝 Hooks (`hooks/`)
- **`useSupabase()`**: Intercepts the Clerk JWT and attaches it to all Supabase requests, ensuring operations are evaluated against RLS policies.
- **`useSavedProperty()`**: Handles the optimistic UI updates and loading states for toggling favorites.
- **`useUserSync()`**: A background hook that silently upserts the Clerk profile into the PostgreSQL `users` table upon successful login.

### 📦 Services (`services/`)
Data fetching logic is decoupled from the UI. Screen components merely consume these services.
- **`properties.ts`**: `fetchProperties()`, `searchProperties(term, type, min, max)`
- **`saved.ts`**: `checkIfPropertySaved()`, `saveProperty()`, `unsaveProperty()`

---

## 🔄 App Workflow & Data Flow

### 1. Authentication
```text
sign-in.tsx → Clerk handles login
  → Stores token securely (expo-secure-store)
  → Redirects to (root)/(tabs)
  → useUserSync() runs → upserts user row in Supabase
```

### 2. Exploring & Filtering
```text
explore.tsx
  → TextInput updates filterStore.setSearch()
  → useEffect watches [search, type, bedrooms, minPrice, maxPrice]
  → Builds and runs a Supabase query inline via services/searchProperties
  → FilterModal taps → setType / setBedrooms / setMinPrice / setMaxPrice
  → Active filters shown as removable chips below the search bar
```

### 3. Admin: Add Listing
```text
add.tsx (only visible if isAdmin = true in userStore)
  → Form: title, description, price, type, beds, baths, area, address, coords
  → Images uploaded to Supabase Storage → URLs stored in images[]
  → Location detected via expo-location or entered manually
  → Submit → authSupabase.from("properties").insert(...)
  → RLS verifies is_admin = true before allowing insert
```

---

## 🔐 Security & Database Strategy (Supabase Setup)

Data integrity and privacy are enforced strictly at the database level using PostgreSQL Row Level Security (RLS). Run all SQL below in your Supabase SQL editor to scaffold the backend.

<details>
<summary><strong>1. Users Table & RLS Policies</strong></summary>

```sql
create table users (
  id uuid default gen_random_uuid() primary key,
  clerk_id text unique not null,
  email text not null,
  first_name text,
  last_name text,
  avatar_url text,
  is_admin boolean default false,
  created_at timestamp with time zone default now()
);

alter table users enable row level security;
create policy "Users can insert own row" on users for insert with check (clerk_id = auth.jwt()->>'sub');
create policy "Users can read own row" on users for select using (clerk_id = auth.jwt()->>'sub');
create policy "Users can update own row" on users for update using (clerk_id = auth.jwt()->>'sub');
```
</details>

<details>
<summary><strong>2. Properties Table & RLS Policies</strong></summary>

```sql
create table properties (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price numeric not null,
  type text not null,
  bedrooms int not null default 1,
  bathrooms int not null default 1,
  area_sqft int,
  address text not null,
  city text not null,
  latitude float,
  longitude float,
  images text[] default '{}',
  is_featured boolean default false,
  is_sold boolean default false,
  created_at timestamp with time zone default now()
);

alter table properties enable row level security;
create policy "Properties are publicly readable" on properties for select using (true);
```
</details>

<details>
<summary><strong>3. Saved Properties Table & RLS Policies</strong></summary>

```sql
create table saved_properties (
  id uuid default gen_random_uuid() primary key,
  user_clerk_id text not null references users(clerk_id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(user_clerk_id, property_id)
);

alter table saved_properties enable row level security;
create policy "Users can read own saved properties" on saved_properties for select using (user_clerk_id = auth.jwt()->>'sub');
create policy "Users can insert saved properties" on saved_properties for insert with check (user_clerk_id = auth.jwt()->>'sub');
create policy "Users can delete own saved properties" on saved_properties for delete using (user_clerk_id = auth.jwt()->>'sub');
```
</details>

<details>
<summary><strong>4. Admin Configuration & Storage Bucket</strong></summary>

```sql
insert into storage.buckets (id, name, public) values ('property-images', 'property-images', true);
create policy "Public can read property images" on storage.objects for select using (bucket_id = 'property-images');

create policy "Admin can insert properties" on properties for insert with check (exists (select 1 from users where clerk_id = auth.jwt()->>'sub' and is_admin = true));
create policy "Admin can update properties" on properties for update using (exists (select 1 from users where clerk_id = auth.jwt()->>'sub' and is_admin = true));
create policy "Admin can delete properties" on properties for delete using (exists (select 1 from users where clerk_id = auth.jwt()->>'sub' and is_admin = true));
create policy "Admin can upload property images" on storage.objects for insert with check (bucket_id = 'property-images' and exists (select 1 from users where clerk_id = auth.jwt()->>'sub' and is_admin = true));

-- Make yourself an admin (replace with your Clerk ID):
-- update users set is_admin = true where clerk_id = 'user_xxxxxxxxxxxxxxxx';
```
</details>

<details>
<summary><strong>5. Seed Properties Data</strong></summary>

All seed images are Unsplash photos of homes, apartments, villas, and commercial buildings.

```sql
insert into properties (
  title, description, price, type, bedrooms, bathrooms,
  area_sqft, address, city, latitude, longitude, images, is_featured
) values

(
  'DHA Phase 6 Grand Villa',
  'A magnificent villa nestled in the heart of DHA Lahore with a private heated pool, landscaped garden, Italian marble flooring, and a fully integrated smart home system. Ideal for families seeking premium living with top-tier security.',
  95000000,
  'villa',
  5, 4, 5200,
  'Street 14, Phase 6, DHA',
  'Lahore',
  31.4726, 74.4085,
  ARRAY[
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    'https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
  ],
  true
),

(
  'Clifton Skyline Penthouse',
  'Breathtaking full-floor penthouse on the 30th floor of a landmark Clifton tower. Enjoy sweeping views of the Arabian Sea from your private rooftop terrace, entertain in the open-plan living area, and unwind in the spa-inspired bathrooms.',
  145000000,
  'penthouse',
  4, 4, 3800,
  'Block 5, Clifton',
  'Karachi',
  24.8138, 67.0300,
  ARRAY[
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800'
  ],
  true
),

(
  'Bahria Town Luxury Apartment',
  'Spacious 3-bedroom apartment on a high floor in Bahria Town Islamabad. Floor-to-ceiling windows frame the lush Margalla Hills, while the premium interiors include a modular kitchen, home theatre setup, and covered parking for two cars.',
  26000000,
  'apartment',
  3, 2, 1900,
  'Bahria Town, Phase 7, Tower A',
  'Islamabad',
  33.5296, 73.1340,
  ARRAY[
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'
  ],
  true
);
```
</details>

---

## 📌 Key Concepts for Beginners

| Concept                  | What it means                                                 |
| ------------------------ | ------------------------------------------------------------- |
| File-based routing       | Each file = a screen. No manual route config needed.          |
| Dynamic routes           | `[id].tsx` becomes `/property/123`, `/property/456`, etc.     |
| Route groups             | `(auth)` organises files without affecting the URL path       |
| Components               | Reusable UI blocks (like functions that return UI)            |
| Hooks                    | Functions that add state or behaviour to components           |
| Zustand store            | Global data shared across any component without prop drilling |
| TypeScript               | JavaScript with type hints — catches bugs before runtime      |
| RLS (Row Level Security) | Supabase checks who you are before allowing DB operations     |
| JWT                      | Clerk login token — passed to Supabase to prove your identity |

---

## ✅ Feature Checklist

- [x] Secure Email/Password Authentication (Clerk)
- [x] OTP email verification on signup
- [x] JWT Integration with Supabase Row Level Security (RLS)
- [x] Premium "Emerald & Pine" UI Redesign (Custom Inline Tokens)
- [x] Property listing with image carousel & deep linking
- [x] Featured properties horizontal scroll
- [x] Full-text search by title and city
- [x] Advanced Filters (Type, Bedrooms, Min/Max Price)
- [x] Global State Management (Zustand)
- [x] User Favorites / Saved Properties
- [x] Embedded Map Preview (OpenStreetMap)
- [x] Full-screen map view & WhatsApp contact integrations
- [x] Admin Listing Upload (with Image Storage)
- [x] Admin Dashboard capabilities (mark as sold, delete listings)
- [x] Robust Keyboard Avoidance across all platforms
- [x] Custom Android Adaptive Icons & Splash Screens

---

## 📈 Roadmap & Future Optimizations

- [ ] **Edge Caching**: Move heavy property queries to Supabase Edge Functions.
- [ ] **Image Optimization**: Implement Cloudflare Image Resizing to dynamically deliver `.webp` based on device DPI.
- [ ] **Offline Maps**: Cache OSM tiles for low-connectivity environments.
- [ ] **Biometric Auth**: Add native FaceID/TouchID integration to the Clerk flow.

---

## 📬 Contact & Support

For questions or support regarding this project, please email: **test.codeatusman@gmail.com**

---
<div align="center">
  <sub>Built with precision and passion for the luxury real estate market.</sub><br>
  <sub><b>⭐ If you found this repository helpful, please give it a star!</b></sub>
</div>
