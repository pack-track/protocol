# PT - Packtrack Protocol
This protocol is used to exchange events and data between members in a packtrack network.

Example message (␤ = \n):
```
PT control/throttle/display␤
speed: 0.52␤
reversed␤
stopped␤␤
Hello, World!
```

## Message Structure
Each message must start with a `PT `.

A route follows, consisting of lowercase latin letters, `-` and numbers conisting of multiple, `/`-separated segments.
There is no leading or trailing `/`.
For future extensions, parsers must ignore everything after the route.

None or multiple headers follow, which may or may not have a value.
A header name may contain lowercase latin letters, `-` and numbers.
The name is terminated by `: `, after which an arbritary text value may follow.
The value may contain a `:`, the only illegal character is a `\n`.
If no `:` is found, the value of the header is boolean `true`, indicating a flag.
A header must end with a new line.

A body may be provided, which starts after the first `\n\n` found in the message.
The body can contain text or binary data.

## Standardized Header Names
Each header must be named after one of the values in the following list.
This is not enforced in code, but serves as a measure to prevent conflicting, duplicate or confusing header names.
Open a pull request if you require a new name.

Values with a `F` indicate flag values.

### General headers
`vendor`: Indicates the vendor of an accessory

### Driving instructions
`speed`: Speed values (0 - 100)
`reverse` F: Reverse direction
