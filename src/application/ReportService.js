// src/application/ReportService.js
export class ReportService {
    static exportToCSV(tasks) {
        if (tasks.length === 0) return;

        const headers = ["ID", "Titulo", "Estado", "Prioridad", "Vencimiento", "Proyecto"];
        const rows = tasks.map(t => [
            t.id, t.title, t.status, t.priority, t.dueDate || 'N/A', t.project || 'General'
        ]);

        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "reporte_tareas.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}