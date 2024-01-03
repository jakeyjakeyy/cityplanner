from datetime import datetime


def hourDiff():
    time = datetime.strptime(str(datetime.utcnow()), "%Y-%m-%d %H:%M:%S.%f")
    startTime = datetime.strptime("2024-01-05T03:00:00Z", "%Y-%m-%dT%H:%M:%SZ")

    diff = startTime - time
    hours_diff = diff.total_seconds() / 3600

    return hours_diff
