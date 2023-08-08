## Description

The application has a home page that lists Marvel characters, with a character search feature. When a character is selected, a detailed character page is displayed, including character name, description, and comic book images. There's a back button that returns the user to the character list, maintaining the state of any search or pagination.

Character images default to the Marvel logo if none are provided. Characters without descriptions display a default text. Note that these default behaviors are not handled in the visual components.

## Live Demo

You can see a live demo at [https://marvel.nafuzi.dev](https://marvel.nafuzi.dev/).

## Requirements

`node` and `pnpm` must be installed on your system.

## Installation

Clone this repository:

```bash
git clone https://github.com/gabrielnafuzi/marvel-characters.git
```

Move into the project directory:

```bash
cd marvel-characters
```

Install dependencies:

```bash
pnpm install
```

## Configuration

Create a `.env` file in the root directory and add the following:

```bash
NEXT_PUBLIC_MARVEL_API_URL=https://gateway.marvel.com/v1/public
NEXT_PUBLIC_MARVEL_API_KEY=<your-marvel-api-key>
MARVEL_API_PRIVATE_KEY=<your-marvel-api-private-key>
```

Replace `<your-marvel-api-key>` and `<your-marvel-api-private-key>` with your actual keys.
You can get them at [Marvel Developer Portal](https://developer.marvel.com).

## Usage

To start the development server:

```bash
pnpm  dev
```

Open `http://localhost:3000` in your browser.