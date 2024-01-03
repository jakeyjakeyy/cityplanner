from datetime import datetime


def hourDiff(startTime, api):
    time = datetime.strptime(str(datetime.utcnow()), "%Y-%m-%d %H:%M:%S.%f")
    if api == "seatgeek":
        startTime = datetime.strptime(startTime, "%Y-%m-%dT%H:%M:%S")
    elif api == "ticketmaster":
        startTime = datetime.strptime(startTime, "%Y-%m-%dT%H:%M:%SZ")

    diff = startTime - time
    hours_diff = diff.total_seconds() / 3600

    return hours_diff
