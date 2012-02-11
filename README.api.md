# API Docs

Here are the backend endpoints that the web frontend talks to.

## {GET.POST} /api/project/:user/:project/history.json

    {
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

