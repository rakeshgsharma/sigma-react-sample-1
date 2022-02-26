export function getNodeColor(status: string) {
    let color = 'grey';
    if (status === 'SUCCESS') {
        color = 'green';
    } else if (status === 'ABENDED') {
        color = 'orange';
    } else if (status === 'FAILURE') {
        color = 'red';
    }
    return color;
}