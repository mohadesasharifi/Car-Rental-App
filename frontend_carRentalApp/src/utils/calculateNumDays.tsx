export default function calculateNumDays(startDate:string, endDate:string) {
    const start = new Date(startDate).getTime(); // Convert startDate to milliseconds
    const end = endDate ? new Date(endDate).getTime() : null; // Convert endDate to milliseconds or null if it's missing

    if (!end) {
        const timeDiff = new Date().getTime() - start; // Calculate time from start date to current date
        const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
        return `${diffDays} days (ongoing)`;
    }

    const timeDiff = end - start; // Difference in milliseconds
    const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

    return `${diffDays} days`; // If endDate exists, return the calculated days
}
