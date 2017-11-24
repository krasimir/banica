import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromise from 'chai-as-promised';

chai.config.truncateThreshold = 0;

global.expect = expect;
global.sinon = sinon;

chai.use(sinonChai);
chai.use(chaiAsPromise);