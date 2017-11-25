
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('is-twinseater', 'helper:is-twinseater', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{is-twinseater inputValue}}`);

  assert.equal(this.$().text().trim(), '1234');
});

