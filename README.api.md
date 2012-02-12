# API Docs

Here are the backend endpoints that the web frontend talks to.

## {GET.POST} /api/project/:user/:project/history.json

    {
      ms: {
        "song1 name / id": {
          "volume":   val,
          "tempo":    val,
          "position": val
        },
        "song 2 name / id": {
          ...
        }
      },
      500: {
        "elmos_song.mp3": {
          "volume":   100,
          "position": 1000
        }
      }
    }

