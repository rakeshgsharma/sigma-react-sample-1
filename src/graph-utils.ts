export function getNodeColor(status: string) {
    let color = 'grey';
    if (status === 'COMPLETED') {
        color = 'green';
    } else if (status === 'COMPLETED WITH DELAY') { // remove this block
        color = 'orange';
    } else if (status === 'FAILED') {
        color = 'red';
    } else if (status === 'DELAYED') {
        color = 'orange';
    } else if (status === 'BLOCKED') {
        color = 'grey';
    }
    return color;
}