import { ThemeProvider } from "@mui/material"
import Button from "@mui/material/Button"
import { customTheme } from "./theme/customeTheme"
import Home from "./customer/pages/Home/Home"

const App = () => {
  return (
    <ThemeProvider theme={customTheme}>
      <Home />
    </ThemeProvider>
  )
}

export default App