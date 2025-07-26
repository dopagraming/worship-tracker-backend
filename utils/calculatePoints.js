export function calculateTotalPoints(completedList, worships) {
    return completedList.reduce((sum, id) => {
        const w = worships.find(w => w.id === id);
        return w ? sum + w.points : sum;
    }, 0);
}