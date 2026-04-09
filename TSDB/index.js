import { InfluxDBClient, Point } from '@influxdata/influxdb3-client'
import 'dotenv/config'

const token = process.env.INFLUXDB_TOKEN
const host = process.env.INFLUXDB_URL
const database = process.env.INFLUXDB_DATABASE || 'DemoBucket'

async function main() {
    if (!host || !token) {
        throw new Error('Missing config. Set INFLUXDB_URL and INFLUXDB_TOKEN environment variables.')
    }

    const client = new InfluxDBClient({ host, token })

    console.log(`Connecting to ${host} | database=${database}`)

    const points =
        [
            new Point("census")
                .tag("location", "Klamath")
                .intField("bees", 23),
            new Point("census")
                .tag("location", "Portland")
                .intField("ants", 30),
            new Point("census")
                .tag("location", "Klamath")
                .intField("bees", 28),
            new Point("census")
                .tag("location", "Portland")
                .intField("ants", 32),
            new Point("census")
                .tag("location", "Klamath")
                .intField("bees", 29),
            new Point("census")
                .tag("location", "Portland")
                .intField("ants", 40)
        ];

    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        await client.write(point, database)
            // separate points by 1 second
            .then(() => new Promise(resolve => setTimeout(resolve, 1000)));
    }

    //QUERY

    const query = `SELECT * FROM 'census' 
WHERE time >= now() - interval '24 hours' AND 
('bees' IS NOT NULL OR 'ants' IS NOT NULL) order by time asc`

    const rows = await client.query(query, database)

    console.log(`${"ants".padEnd(5)}${"bees".padEnd(5)}${"location".padEnd(10)}${"time".padEnd(15)}`);
    for await (const row of rows) {
        let ants = row.ants || '';
        let bees = row.bees || '';
        let time = new Date(row.time);
        console.log(`${ants.toString().padEnd(5)}${bees.toString().padEnd(5)}${row.location.padEnd(10)}${time.toString().padEnd(15)}`);
    }



    client.close()
}

main().catch((err) => {
    console.error('InfluxDB connection/query failed:', err.message)
    process.exit(1)
})