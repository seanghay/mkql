# mkql.deno.dev

An instant GraphQL doc viewer powered by Deno.

<img src="https://raw.githubusercontent.com/seanghay/mkql/main/mkql.png" width="800">

## Usage

There are several methods

### Method 1

Using query params

```
https://mkql.deno.dev/?url=https://api.spacex.land/graphql
```

[Visit](https://mkql.deno.dev/?url=https://api.spacex.land/graphql)


> **protocol** is optional (default: `https`)

```
https://mkql.deno.dev/?url=api.spacex.land/graphql
```

[Visit](https://mkql.deno.dev/?url=api.spacex.land/graphql)

---

### Method 2

Using path

```
https://mkql.deno.dev/api.spacex.land/graphql
```

[Visit](https://mkql.deno.dev/api.spacex.land/graphql)

Nested path

```
https://mkql.deno.dev/api.spacex.land/api/south-east-1/graphql
```

---

### Method 3 (Recommended)

It will add `/graphql` add the end if no path is provided

```
https://mkql.deno.dev/api.spacex.land
```
[Visit](https://mkql.deno.dev/api.spacex.land)

