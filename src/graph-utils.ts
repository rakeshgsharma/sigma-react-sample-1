export function getNodeColor(status: string) {
    let color = 'grey';
    if (status === 'COMPLETED') {
        color = 'green';
    } else if (status === 'COMPLETED WITH DELAY') {
        color = 'orange';
    } else if (status === 'FAILED') {
        color = 'red';
    }
    return color;
}