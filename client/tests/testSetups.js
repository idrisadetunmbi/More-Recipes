import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

global.Materialize = { toast: jest.fn() };
global.methodSpy = (component, name) => jest.spyOn(component.instance(), name);
global.$ = () => ({ dropdown: jest.fn(), tabs: jest.fn() });
