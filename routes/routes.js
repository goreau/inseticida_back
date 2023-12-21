var express = require("express")
var app = express();
var router = express.Router();

const HomeController = require("../controllers/HomeController");
const UserController = require("../controllers/UserController");
const ProdutoController = require("../controllers/ProdutoController");
const LoteController = require("../controllers/LoteController");
const RevalidaController = require("../controllers/RevalidaController");
const AuxiliarController = require("../controllers/AuxiliarController");

var AdminAuth = require("../middleware/AdminAuth");


router.get('/', HomeController.index);
router.get('/validate', AdminAuth, HomeController.index);
router.post('/user', AdminAuth, UserController.create);
router.put('/user', AdminAuth, UserController.update);
router.put('/editUser', AdminAuth, UserController.edit);
router.post("/login", UserController.login);
router.get("/user/:id", AdminAuth, UserController.getUser);
router.get("/users", AdminAuth, UserController.getUsers);
router.delete("/user/:id", AdminAuth, UserController.remove);

router.post('/unidade', AdminAuth, AuxiliarController.createUnidade);
router.get("/unidade/:id", AdminAuth, AuxiliarController.getUnidade);
router.put('/unidade', AdminAuth, AuxiliarController.updateUnidade);
router.get("/unidades/:filter", AdminAuth, AuxiliarController.getUnidades);
router.delete('/unidade/:id', AdminAuth, AuxiliarController.deleteUnidade);
router.get('/unidadescombo', AdminAuth, AuxiliarController.getUnidadesCombo);

router.post('/produto', AdminAuth, ProdutoController.createProduto);
router.get("/produto/:id", AdminAuth, ProdutoController.getProduto);
router.put('/produto', AdminAuth, ProdutoController.updateProduto);
router.get("/produtos/:filter", AdminAuth, ProdutoController.getProdutos);
router.delete('/produto/:id', AdminAuth, ProdutoController.deleteProduto);
router.get('/produtoscombo', AdminAuth, ProdutoController.getProdutosCombo);

router.post('/lote', AdminAuth, LoteController.createLote);
router.get("/lote/:id", AdminAuth, LoteController.getLote);
router.put('/lote', AdminAuth, LoteController.updateLote);
router.get("/lotes/:filter", AdminAuth, LoteController.getLotes);
router.delete('/lote/:id', AdminAuth, LoteController.deleteLote);
router.get('/lotescombo', AdminAuth, LoteController.getLotesCombo);

router.post('/revalida', AdminAuth, RevalidaController.createRevalida);
router.get("/revalida/:id", AdminAuth, RevalidaController.getRevalida);
router.put('/revalida', AdminAuth, RevalidaController.updateRevalida);
router.get("/revalidas/:filter", AdminAuth, RevalidaController.getRevalidas);
router.delete('/revalida/:id', AdminAuth, RevalidaController.deleteRevalida);
router.get('/revalidascombo', AdminAuth, RevalidaController.getRevalidasCombo);

module.exports = router;