// Urenregistratie App voor iPhone

// Import benodigde frameworks
import SwiftUI
import Foundation

// Data modellen
struct Taak: Identifiable, Codable {
    let id: UUID
    var naam: String
    var uren: [Date: Double]
}

struct UrenRegistratie {
    var taken: [Taak]
    
    // Bereken totaal uren per week
    func totaalUrenPerWeek(week: Date) -> Double {
        var totaal = 0.0
        for taak in taken {
            totaal += taak.uren.filter { isInZelfdeWeek($0.key, week) }.values.reduce(0, +)
        }
        return totaal
    }
    
    // Bereken totaal uren per taak
    func totaalUrenPerTaak(taakId: UUID) -> Double {
        guard let taak = taken.first(where: { $0.id == taakId }) else { return 0 }
        return taak.uren.values.reduce(0, +)
    }
}

// Hoofdview
struct ContentView: View {
    @State private var urenRegistratie = UrenRegistratie(taken: [])
    @State private var geselecteerdeDatum = Date()
    
    var body: some View {
        NavigationView {
            VStack {
                // Datumkiezer
                DatePicker("Selecteer datum", selection: $geselecteerdeDatum, displayedComponents: .date)
                    .datePickerStyle(GraphicalDatePickerStyle())
                    .padding()
                
                // Lijst met taken
                List {
                    ForEach(urenRegistratie.taken) { taak in
                        TaakRijView(taak: taak, datum: geselecteerdeDatum)
                    }
                }
                
                // Weekoverzicht
                WeekOverzichtView(urenRegistratie: urenRegistratie, week: geselecteerdeDatum)
            }
            .navigationTitle("Urenregistratie")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Exporteer") {
                        exporteerData()
                    }
                }
            }
        }
        .onAppear {
            laadData()
        }
    }
    
    // Helper functies
    func laadData() {
        // Implementeer Excel import
    }
    
    func exporteerData() {
        // Implementeer export functionaliteit
    }
}

// Helper views
struct TaakRijView: View {
    let taak: Taak
    let datum: Date
    @State private var uren: String = ""
    
    var body: some View {
        HStack {
            Text(taak.naam)
            Spacer()
            TextField("Uren", text: $uren)
                .keyboardType(.decimalPad)
                .frame(width: 60)
        }
    }
}

struct WeekOverzichtView: View {
    let urenRegistratie: UrenRegistratie
    let week: Date
    
    var body: some View {
        VStack {
            Text("Week Totaal: \(urenRegistratie.totaalUrenPerWeek(week: week), specifier: "%.1f") uren")
                .font(.headline)
                .padding()
        }
    }
}

// Helper functies
func isInZelfdeWeek(_ date1: Date, _ date2: Date) -> Bool {
    Calendar.current.isDate(date1, equalTo: date2, toGranularity: .weekOfYear)
}
