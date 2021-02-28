/* eslint-disable max-classes-per-file */
import Blockly from 'blockly';
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview The full custom renderer built during the custom renderer
 * codelab, in ES6 syntax.
 * @author fenichel@google.com (Rachel Fenichel)
 */

class CustomConstantsProvider extends Blockly.blockRendering.ConstantProvider {
  constructor() {
    // Set up all of the constants from the base provider.
    super();

    this.GRID_UNIT = 0;

    /**
   * @override
   */
    this.SMALL_PADDING = this.GRID_UNIT;

    /**
   * @override
   */
    this.MEDIUM_PADDING = 2 * this.GRID_UNIT;

    /**
   * @override
   */
    this.MEDIUM_LARGE_PADDING = 3 * this.GRID_UNIT;

    /**
   * @override
   */
    this.LARGE_PADDING = 4 * this.GRID_UNIT;

    /**
   * @override
   */
    this.CORNER_RADIUS = 1 * this.GRID_UNIT;

    /**
   * @override
   */
    this.NOTCH_WIDTH = 9 * this.GRID_UNIT;

    /**
   * @override
   */
    this.NOTCH_HEIGHT = 2 * this.GRID_UNIT;

    /**
   * @override
   */
    this.NOTCH_OFFSET_LEFT = 3 * this.GRID_UNIT;

    /**
   * @override
   */
    this.STATEMENT_INPUT_NOTCH_OFFSET = this.NOTCH_OFFSET_LEFT;

    /**
   * @override
   */
    this.MIN_BLOCK_WIDTH = 2 * this.GRID_UNIT;

    /**
   * @override
   */
    this.MIN_BLOCK_HEIGHT = 12 * this.GRID_UNIT;

    /**
   * @override
   */
    this.EMPTY_STATEMENT_INPUT_HEIGHT = 6 * this.GRID_UNIT;

    /**
   * @override
   */
    this.TAB_OFFSET_FROM_TOP = 0;

    /**
   * @override
   */
    this.TOP_ROW_MIN_HEIGHT = this.CORNER_RADIUS;

    /**
   * @override
   */
    this.TOP_ROW_PRECEDES_STATEMENT_MIN_HEIGHT = this.LARGE_PADDING;

    /**
   * @override
   */
    this.BOTTOM_ROW_MIN_HEIGHT = this.CORNER_RADIUS;

    /**
   * @override
   */
    this.BOTTOM_ROW_AFTER_STATEMENT_MIN_HEIGHT = 6 * this.GRID_UNIT;

    /**
   * @override
   */
    this.STATEMENT_BOTTOM_SPACER = -this.NOTCH_HEIGHT;

    /**
   * Minimum statement input spacer width.
   * @type {number}
   */
    this.STATEMENT_INPUT_SPACER_MIN_WIDTH = 40 * this.GRID_UNIT;

    /**
   * @override
   */
    this.STATEMENT_INPUT_PADDING_LEFT = 4 * this.GRID_UNIT;

    /**
   * @override
   */
    this.EMPTY_INLINE_INPUT_PADDING = 4 * this.GRID_UNIT;

    /**
   * @override
   */
    this.EMPTY_INLINE_INPUT_HEIGHT = 8 * this.GRID_UNIT;

    /**
   * @override
   */
    this.DUMMY_INPUT_MIN_HEIGHT = 8 * this.GRID_UNIT;

    /**
   * @override
   */
    this.DUMMY_INPUT_SHADOW_MIN_HEIGHT = 6 * this.GRID_UNIT;

    /**
   * @override
   */
    this.CURSOR_WS_WIDTH = 20 * this.GRID_UNIT;

    /**
   * @override
   */
    this.CURSOR_COLOUR = '#ffa200';

    /**
   * Radius of the cursor for input and output connections.
   * @type {number}
   * @package
   */
    this.CURSOR_RADIUS = 5;

    /**
   * @override
   */
    this.JAGGED_TEETH_HEIGHT = 0;

    /**
   * @override
   */
    this.JAGGED_TEETH_WIDTH = 0;

    /**
   * @override
   */
    this.START_HAT_HEIGHT = 11;

    /**
   * @override
   */
    this.START_HAT_WIDTH = 32;

    /**
   * @enum {number}
   * @override
   */
    this.SHAPES = {
      HEXAGONAL: 1,
      ROUND: 2,
      SQUARE: 3,
      PUZZLE: 4,
      NOTCH: 5,
    };

    /**
   * Map of output/input shapes and the amount they should cause a block to be
   * padded. Outer key is the outer shape, inner key is the inner shape.
   * When a block with the outer shape contains an input block with the inner
   * shape on its left or right edge, the block elements are aligned such that
   * the padding specified is reached.
   * @package
   */
    this.SHAPE_IN_SHAPE_PADDING = {
      1: { // Outer shape: hexagon.
        0: 5 * this.GRID_UNIT, // Field in hexagon.
        1: 2 * this.GRID_UNIT, // Hexagon in hexagon.
        2: 5 * this.GRID_UNIT, // Round in hexagon.
        3: 5 * this.GRID_UNIT, // Square in hexagon.
      },
      2: { // Outer shape: round.
        0: 3 * this.GRID_UNIT, // Field in round.
        1: 3 * this.GRID_UNIT, // Hexagon in round.
        2: 1 * this.GRID_UNIT, // Round in round.
        3: 2 * this.GRID_UNIT, // Square in round.
      },
      3: { // Outer shape: square.
        0: 2 * this.GRID_UNIT, // Field in square.
        1: 2 * this.GRID_UNIT, // Hexagon in square.
        2: 2 * this.GRID_UNIT, // Round in square.
        3: 2 * this.GRID_UNIT, // Square in square.
      },
    };

    /**
   * @override
   */
    this.FULL_BLOCK_FIELDS = true;

    /**
   * @override
   */
    this.FIELD_TEXT_FONTSIZE = 1;// 3 * this.GRID_UNIT;

    /**
   * @override
   */
    this.FIELD_TEXT_FONTWEIGHT = 'bold';

    /**
   * @override
   */
    this.FIELD_TEXT_FONTFAMILY =
    '"Helvetica Neue", "Segoe UI", Helvetica, sans-serif';

    /**
   * @override
   */
    this.FIELD_BORDER_RECT_RADIUS = this.CORNER_RADIUS;

    /**
   * @override
   */
    this.FIELD_BORDER_RECT_X_PADDING = 2 * this.GRID_UNIT;

    /**
   * @override
   */
    this.FIELD_BORDER_RECT_Y_PADDING = 1.625 * this.GRID_UNIT;

    /**
   * @override
   */
    this.FIELD_BORDER_RECT_HEIGHT = 8 * this.GRID_UNIT;

    /**
   * @override
   */
    this.FIELD_DROPDOWN_BORDER_RECT_HEIGHT = 8 * this.GRID_UNIT;

    /**
   * @override
   */
    this.FIELD_DROPDOWN_NO_BORDER_RECT_SHADOW = true;

    /**
   * @override
   */
    this.FIELD_DROPDOWN_COLOURED_DIV = true;

    /**
   * @override
   */
    this.FIELD_DROPDOWN_SVG_ARROW = true;

    /**
   * @override
   */
    this.FIELD_DROPDOWN_SVG_ARROW_PADDING = this.FIELD_BORDER_RECT_X_PADDING;

    /**
   * @override
   */
    this.FIELD_TEXTINPUT_BOX_SHADOW = true;

    /**
   * @override
   */
    this.FIELD_COLOUR_FULL_BLOCK = true;

    /**
   * @override
   */
    this.FIELD_COLOUR_DEFAULT_WIDTH = 2 * this.GRID_UNIT;

    /**
   * @override
   */
    this.FIELD_COLOUR_DEFAULT_HEIGHT = 4 * this.GRID_UNIT;

    /**
   * @override
   */
    this.FIELD_CHECKBOX_X_OFFSET = 1 * this.GRID_UNIT;

    /**
   * The maximum width of a dynamic connection shape.
   * @type {number}
   */
    this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH = 12 * this.GRID_UNIT;

    /**
   * The selected glow colour.
   * @type {string}
   */
    this.SELECTED_GLOW_COLOUR = '#fff200';

    /**
   * The size of the selected glow.
   * @type {number}
   */
    this.SELECTED_GLOW_SIZE = 0.5;

    /**
   * The replacement glow colour.
   * @type {string}
   */
    this.REPLACEMENT_GLOW_COLOUR = '#fff200';

    /**
   * The size of the selected glow.
   * @type {number}
   */
    this.REPLACEMENT_GLOW_SIZE = 2;

    /**
   * The ID of the selected glow filter, or the empty string if no filter is
   * set.
   * @type {string}
   * @package
   */
    this.selectedGlowFilterId = '';

    /**
   * The <filter> element to use for a selected glow, or null if not set.
   * @type {SVGElement}
   * @private
   */
    this.selectedGlowFilter_ = null;

    /**
   * The ID of the replacement glow filter, or the empty string if no filter is
   * set.
   * @type {string}
   * @package
   */
    this.replacementGlowFilterId = '';

    /**
   * The <filter> element to use for a replacement glow, or null if not set.
   * @type {SVGElement}
   * @private
   */
    this.replacementGlowFilter_ = null;
  }
}

class CustomRenderer extends Blockly.zelos.Renderer {
  makeConstants() {
    return new CustomConstantsProvider();
  }
}

//Blockly.blockRendering.register('custom_renderer', CustomRenderer);
