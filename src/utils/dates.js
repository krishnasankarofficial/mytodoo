import dayjs from "dayjs"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

export { dayjs }

export function startOfLocalDay(d = new Date()) {
    return dayjs(d).startOf("day")
}

export function isDueToday(iso) {
    if (!iso) return false
    const d = dayjs(iso)
    return d.isSame(dayjs(), "day")
}

export function isOverdue(iso) {
    if (!iso) return false
    return dayjs(iso).isBefore(dayjs(), "day")
}

export function isDueThisWeek(iso) {
    if (!iso) return false
    const d = dayjs(iso)
    return d.isSameOrAfter(dayjs().startOf("week"), "day") && d.isSameOrBefore(dayjs().endOf("week"), "day")
}
