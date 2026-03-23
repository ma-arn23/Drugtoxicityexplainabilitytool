
# Drug Toxicity Explainability Tool

A frontend prototype for an explainable drug toxicity analysis workflow.

This application allows a user to submit a **SMILES string** and view:
- a **toxicity prediction summary**
- a **mechanistic explanation layer**
- **curated biological evidence**
- supporting **confidence and provenance information**

The goal of the interface is to make toxicity predictions easier to interpret by combining model outputs with structured mechanistic evidence.

## Project purpose

This project is part of a group workflow focused on improving the interpretability of drug toxicity prediction systems.

The frontend is designed to support:
- **SMILES-based input**
- integration with a **prediction API** such as ProTox
- display of **curated mechanism evidence** from structured datasets
- presentation of **risk flags** and explanation panels for end users

## Current status

This repository currently contains the **frontend application** and uses **mock data** for the results page while backend/API integration is still in progress.

Planned integration includes:
- ProTox prediction response parsing
- curated mechanism data from the project database
- explainability/rule-based overlays linking prediction outputs to mechanistic evidence

## Tech stack

- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- Figma-generated UI foundation, refined locally in code

## Project structure

```text
src/
  app/
    components/
      ui/               # reusable UI components
    pages/
      InputPage.tsx     # SMILES input screen
      ResultsPage.tsx   # toxicity results and explainability screen
    types/
      explainability.ts # shared frontend data types
  App.tsx
  routes.ts
  main.tsx

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.
Open the website via http://localhost:5174/