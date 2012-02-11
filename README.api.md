# API Docs

Here are the backend endpoints that the web frontend talks to.

## POST /api/save.json

    {
      "user": "reed",
      "project": "dubstep 5",
      "ms": {
        "song1 name / id": {
          "volume": diff,
          "tempo": diff,
          "position": diff
        },
        "song 2 name / id": {
          ...
        }
      }
    }

