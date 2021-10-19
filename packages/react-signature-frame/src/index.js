import React from 'react'
import PropTypes from 'prop-types'

class AnvilSignatureFrame extends React.Component {
  constructor (props) {
    super(props)
    this.iframeRef = React.createRef()
  }

  componentDidMount () {
    const { scroll } = this.props
    window.addEventListener('message', this.handleSignFinish)
    if (scroll) this.iframeRef.current.scrollIntoView({ behavior: scroll })
  }

  componentWillUnmount () {
    window.removeEventListener('message', this.handleSignFinish)
  }

  handleSignFinish = ({ origin, data }) => {
    if (this.props.anvilURL !== origin) return
    if (typeof data === 'string') {
      this.props.onFinish(data)

      const searchStr = data.split('?')[1]
      const searchObj = JSON.parse('{"' + decodeURI(searchStr).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
      const { signerStatus, signerEid, documentGroupStatus, documentGroupEid, etchPacketEid, weldDataEid } = searchObj
      this.props.onFinishSigning({
        action: 'signerComplete',
        signerStatus,
        signerEid,
        documentGroupStatus,
        documentGroupEid,
        etchPacketEid,
        weldDataEid,
      })
    }
  }

  render () {
    const { signURL, onLoad, enableDefaultStyles, ...otherProps } = this.props
    const { iframeWarningProps, ...anvilFrameProps } = otherProps
    return (
      <iframe
        id="anvil-signature-frame"
        name="Anvil Etch E-Sign"
        title="Anvil Etch E-Sign"
        style={enableDefaultStyles
          ? {
              width: '80vw',
              height: '85vh',
              maxWidth: '1200px',
              borderStyle: 'groove',
            }
          : undefined}
        {...anvilFrameProps}
        src={signURL + '&withinIframe=true'}
        onLoad={onLoad}
        ref={this.iframeRef}
      >
        <p className="anvil-iframe-warning" {...iframeWarningProps}>Your browser does not support iframes.</p>
      </iframe>
    )
  }
}

AnvilSignatureFrame.defaultProps = {
  onFinish: (url) => {
    console.log('RedirectURL:', url)
  },
  onFinishSigning: (payload) => {
    console.log('Payload:', payload)
  },
  anvilURL: 'https://app.useanvil.com',
  enableDefaultStyles: true,
}

AnvilSignatureFrame.propTypes = {
  signURL: PropTypes.string,
  scroll: PropTypes.string,
  onLoad: PropTypes.func,
  onFinish: PropTypes.func,
  onFinishSigning: PropTypes.func,
  anvilURL: PropTypes.string,
  enableDefaultStyles: PropTypes.bool,
}

export default AnvilSignatureFrame
