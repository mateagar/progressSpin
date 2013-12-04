// Copyright (c) 2013 Intuit, Inc
// Author: Matthew Eagar (matthew_eagar@intuit.com)
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

(function($) {
    $.fn.progressSpin = function (options) {
        //----------------------------------------------------------------------
        //* Poor man's singleton 
        //----------------------------------------------------------------------
        if (this.getOptions) {
            return this;
        }
    
        //----------------------------------------------------------------------
        //* Private variables 
        //----------------------------------------------------------------------
        var _options = $.extend({}, $.fn.progressSpin.defaults, options);
        var _steps = [];
        var _visible = false;
        var _animationInterval = null;
        var _currentStepIndex = 0;
        var _paper = null; 
        var _progress = this;
        
        //----------------------------------------------------------------------
        //* Private methods 
        //----------------------------------------------------------------------
        function setActive(stepIndex, activeLevel) {
            var inactiveLevel = 1 - activeLevel;
            var activeColor = Raphael.getRGB(_options.activeColor);
            var fillColor = Raphael.getRGB(_options.fillColor);
            var red = Math.floor((activeColor.r * activeLevel) + 
                                 (fillColor.r * inactiveLevel));
            var green = Math.floor((activeColor.g * activeLevel) +
                                   (fillColor.g * inactiveLevel));
            var blue = Math.floor((activeColor.b * activeLevel) +
                                  (fillColor.b * inactiveLevel));
            var renderColor = Raphael.rgb(red, green, blue);
            _steps[stepIndex].attr("fill", renderColor);
        };
        
        function circulateStepIndex(stepIndex) {
            stepIndex = stepIndex % 12;
            if (stepIndex < 0) {
                stepIndex += 12;
            }
            return stepIndex;
        }
        
        //----------------------------------------------------------------------
        //* Public properties 
        //----------------------------------------------------------------------
        this.getOptions = function () {
            return _options;
        };
        
        this.getVisible = function () {
            return _visible;
        }
        
        this.getAnimating = function () {
            return _animationInterval != null;
        }
        
        this.getCurrentStep = function () {
            return _currentStepIndex;
        };

        this.setCurrentStep = function (stepIndex) {
            if (this.getAnimating()) {
                this.stop(false);
                _currentStepIndex = circulateStepIndex(stepIndex);
                this.start();
            }
            else {
                _currentStepIndex = circulateStepIndex(stepIndex);
            }
        };
        
        //----------------------------------------------------------------------
        //* Public methods
        //----------------------------------------------------------------------
        this.start = function () {
            if (this.getAnimating()) {
                // continue
            }
            else {
                this.show();
    
                setActive(_currentStepIndex, 1);
                
                var tailRatio = 1 / (_options.tailCount + 1);
                var currentTailCount = 0;
                var maxTailCount = _options.tailCount;
                _animationInterval = setInterval(function () {
                    if (currentTailCount < maxTailCount) {
                        currentTailCount++;
                    }
                    
                    _currentStepIndex = circulateStepIndex(_currentStepIndex + 1);
                    var currentActiveLevel = 1;
                    for (var tailCounter = 0; 
                         tailCounter <= currentTailCount + 1; 
                         tailCounter++) {
                        var stepIndex = circulateStepIndex(_currentStepIndex - tailCounter);
                        setActive(stepIndex, 1 - tailCounter * tailRatio);
                    }
                    
                }, Math.floor(_options.cycleTime / 12));
            }
        };  
        
        this.stop = function (hide) {
            if (hide == null) {
                hide = true;
            }
            
            if (_animationInterval) {
                clearInterval(_animationInterval);
                _animationInterval = null;
            }
            
            var fillColor = _options.fillColor;
            _steps.forEach(function (step) {
                step.attr("fill", fillColor);
            })
            
            if (hide) {
                this.hide();
            }
        };
        
        this.show = function () {
            if (_steps.length == 0) {
                this.render();
            }
            else {
                if (_visible) {
                    // continue
                }
                else {
                    _steps.forEach(function (step) {
                        step.show();
                    });
                    _visible = true;  
                }
            }          
        }
        
        this.hide = function () {
            if (this.getAnimating()) {
                this.stop(false);
            }
            
            if (_visible) {
                _steps.forEach(function (step) {
                    step.hide();
                });
            }
            _visible = false;
        }
        
        this.render = function() {
            if (this.getAnimating()) {
                this.stop(false);
            }

            if (_paper) {
                _steps = [];
                _paper.clear();
                _paper.setSize(this.width(), this.height());
            }
            else {
                _paper = Raphael(this.get(0), this.width(), this.height());
            }
            
            var centerX = Math.floor(this.width() / 2);
            var centerY = Math.floor(this.height() / 2);
            var radius = centerX;
            if (centerY < radius) {
                radius = centerY;
            }
            
            var firstStepX = centerX - Math.floor(_options.stepWidth / 2);
            var firstStepY = centerY - radius;
            var firstStepHeight = 
                radius - Math.floor(radius * _options.knockOutRatio);
            var firstStep = _paper.rect(firstStepX, 
                                        firstStepY, 
                                        _options.stepWidth, 
                                        firstStepHeight, 
                                        _options.cornerRadius);
            firstStep.attr("fill", _options.fillColor);
            firstStep.attr("stroke-width", 0);
            _steps[0] = firstStep;
            
            var angle = 30;
            for (var counter = 1; counter <= 11; counter++) {
                var newStep = firstStep.clone();
                newStep.transform("r" + angle + "," + centerX + "," + centerY);
                _steps[counter] = newStep;
                angle += 30;
            }
            
            _visible = true;
        }
        
        return this;
    };
    
    //--------------------------------------------------------------------------
    //* Class defaults
    //--------------------------------------------------------------------------
    $.fn.progressSpin.defaults = {
        activeColor: "#000000",
        fillColor: "#aaaaaa",
        cycleTime: 1000,
        tailCount: 6,
        stepWidth: 5,
        cornerRadius: 2,
        knockOutRatio: 0.5
    };
}(jQuery));