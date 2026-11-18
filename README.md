# City Letter Counter

Enter a letter and see how many of the world's 50 most populous cities (from [GeoNames](https://www.geonames.org/)) start with it.

## Stack

- **Backend:** Node.js 20.12+, Express 5
- **Frontend:** plain HTML, CSS and JavaScript

## Run

Create `.env` from the template:

```bash
cp .env.example .env
```

Then install and start:

```bash
npm install
npm start
```

Open http://localhost:3000.

Development mode with auto-restart:

```bash
npm run dev
```

## Tests

```bash
npm test
```

Uses the built-in `node:test` runner. GeoNames is replaced with a fake client, so no network or
`.env` is needed.

## API

### `GET /api/cities/count?letter=<letter>`

Returns the cities from the top 50 whose name starts with the given letter (case-insensitive).

| Parameter | Required | Description                     |
|-----------|----------|---------------------------------|
| `letter`  | yes      | a single Latin letter, `a`–`z`  |

Response `200`:

```json
{
  "letter": "c",
  "count": 3,
  "cities": [
    { "name": "Chongqing", "country": "China" },
    { "name": "Chengdu", "country": "China" },
    { "name": "Cairo", "country": "Egypt" }
  ]
}
```

Errors return `{ "error": "<message>" }`:

| Status | When                                         |
|--------|----------------------------------------------|
| `400`  | `letter` is missing or not a single letter   |
| `404`  | unknown route                                |
| `502`  | GeoNames is unavailable or returned an error |

## Notes

- **The `r` example.** The task says `r` should return 1 city (Rio de Janeiro). GeoNames does not
  return a stable top 50: in my testing, Rio de Janeiro was in the list in about 1 of 3 requests,
  so `r` returns either 1 or 0. This depends on the `maxRows=50` limit and on the data GeoNames
  returns at the moment, not on the counting logic: `c` returns 3 (Chongqing, Chengdu, Cairo), as
  expected. Note that the app caches the GeoNames response for 10 minutes, so the result for `r`
  stays the same until the cache expires or the server restarts.
