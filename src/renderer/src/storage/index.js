import {permanent,initStorage} from "./permanent"
import temporary from "./temporary"
initStorage()
const storage = {
    ...temporary,
    ...permanent,
}
export default storage
