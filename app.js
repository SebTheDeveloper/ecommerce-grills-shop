import express from 'express'
import path from 'path'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'

config()

const app = express()
const port = process.env.PORT || 3000

const currentFilePath = fileURLToPath(import.meta.url)
const currentDirectory = path.dirname(currentFilePath)

const absoluteDistPath = path.resolve(currentDirectory, 'dist')
const absoluteIndexPath = path.join(absoluteDistPath, 'index.html')

app.use(express.static(absoluteDistPath))

app.get('*', (req, res) => {
  res.sendFile(absoluteIndexPath)
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})