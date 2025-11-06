# PT - Packtrack Protocol
This protocol is used to exchange events and data between members in a packtrack network.

Standardized messages are defined in source/messages

Example message:
```
PT control/throttle/display
speed: 0.52
reversed
stopped

Hello, World!
```

## Message Structure
Each message must start with a `PT `.

A route follows, consisting of lowercase latin letters, `-` and numbers conisting of multiple, `/`-separated segments.
There is no leading or trailing `/`.
For future extensions, parsers must ignore everything after the route.

None or multiple headers follow, which may or may not have a value.
A unique header name may contain lowercase latin letters, `-` and numbers.
The name is terminated by `: `, after which an arbritary text value may follow.
The value may contain a `:`, the only illegal character is a `\n`.
If no `:` is found, the value of the header is boolean `true`, indicating a flag.
A header must end with a new line.
Space may be limited on embedded devices, where a cap on header count may be set no smaller than 32.

Setting `null` as a header value will omit it.
This will only work if the header is optional, unexpected nulls might raise an error on the receiving side.

A body may be provided, which starts after the first `\n\n` found in the message.
The body can contain text or binary data.
