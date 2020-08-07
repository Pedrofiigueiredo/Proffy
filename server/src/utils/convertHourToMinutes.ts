export default function convertHourToMinutes(time: String) {
    // Divide Horas e Minutos e converte em números
    const [hour, minutes] = time.split(':').map(Number);
    const timeInMinutes = (hour * 60) + minutes;

    return timeInMinutes;
};