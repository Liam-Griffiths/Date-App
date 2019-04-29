var router = require('express').Router();

router.use('/', require('./users'));
router.use('/mail', require('./mailinput'));
router.use('/happy', require('./happyres'));
router.use('/review', require('./review'));

router.use('/test', require('./test'));

router.use(function(err, req, res, next){
  if(err.name === 'ValidationError'){
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key){
        errors[key] = err.errors[key].message;

        return errors;
      }, {})
    });
  }

  return next(err);
});

router.get('/', function(req, res, next){
  return res.json("I'm Alive. Thank You for Asking.");
});
router.post('/', function(req, res, next){
  return res.json("I'm Alive. Thank You for Posting.");
});

module.exports = router;