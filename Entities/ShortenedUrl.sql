{
  "name": "ShortenedUrl",
  "type": "object",
  "properties": {
    "original_url": {
      "type": "string",
      "description": "The original long URL"
    },
    "short_code": {
      "type": "string",
      "description": "The shortened URL code"
    },
    "clicks": {
      "type": "number",
      "default": 0,
      "description": "Number of times the short URL was accessed"
    },
    "custom_alias": {
      "type": "string",
      "description": "Optional custom alias"
    }
  },
  "required": [
    "original_url",
    "short_code"
  ]
}