import Marlinspike from 'marlinspike'
import webpack from 'webpack'
import _ from 'lodash'

class Webpack extends Marlinspike {
  constructor (sails) {
    super(sails, module)
  }

  configure () {
    let config = this.sails.config


    if (!config.webpack.options) {
      sails.log.warn('sails-webpack: no Webpack "options" are defined.')
      sails.log.warn('sails-webpack: Please configure config/webpack.js')
    }
  }

  initialize (next) {
    let config = this.sails.config
    next()

    sails.after('lifted', () => {
      this.compiler = webpack(_.extend({ }, this.sails.config.webpack.options), (err, stats) => {
        if (err) throw err;

        sails.log.info('sails-webpack: compiler loaded.')
        sails.log.silly('sails-webpack: ', stats.toString())

        if (process.env.NODE_ENV == 'development') {
          sails.log.info('sails-webpack: watching...')
          this.compiler.watch(_.extend({ }, this.sails.config.webpack.watchOptions), this.afterBuild)
        }
        else {
          sails.log.info('sails-webpack: running...')
          this.compiler.run(this.afterBuild)
        }
      })
    })
  }

  afterBuild (err, rawStats) {
    if (err) return sails.log.error('sails-webpack: FATAL ERROR', err)

    let stats = rawStats.toJson()

    sails.log.debug('sails-webpack: Build Info\n' + rawStats.toString({
      colors: true,
      chunks: false
    }))

    if (stats.errors.length > 0) {
      sails.log.error('sails-webpack:', stats.errors)
    }
    if (stats.warnings.length > 0) {
      sails.log.warn('sails-webpack:', stats.warnings)
    }
  }
}

module.exports = Marlinspike.createSailsHook(Webpack)
