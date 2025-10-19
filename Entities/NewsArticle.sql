{
  "name": "NewsArticle",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Article title"
    },
    "summary": {
      "type": "string",
      "description": "Brief summary of the article"
    },
    "url": {
      "type": "string",
      "description": "Link to full article"
    },
    "source": {
      "type": "string",
      "description": "News source"
    },
    "published_date": {
      "type": "string",
      "format": "date-time",
      "description": "When the article was published"
    },
    "category": {
      "type": "string",
      "enum": [
        "ai-models",
        "products",
        "research",
        "industry",
        "ethics",
        "other"
      ],
      "default": "other"
    },
    "is_archived": {
      "type": "boolean",
      "default": false,
      "description": "Whether the article is archived"
    }
  },
  "required": [
    "title",
    "summary",
    "published_date"
  ]
}